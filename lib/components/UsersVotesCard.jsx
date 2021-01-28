import React, { useContext, useState } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useAtom } from 'jotai'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useSocialIdentity } from 'lib/hooks/useTwitterProfile'
import { useTokenHolder } from 'lib/hooks/useTokenHolder'
import { useTranslation } from 'i18n/../i18n'
import { PTHint } from 'lib/components/PTHint'

export const UsersVotesCard = (props) => {
  const { blockNumber, className } = props
  const { usersAddress } = useContext(AuthControllerContext)
  const {
    data: tokenHolder,
    loading: tokenHolderIsLoading,
    isDataFromBeforeCurrentBlock,
    refetch: refetchTokenHolderData
  } = useTokenHolder(
    // '0x7e4A8391C728fEd9069B2962699AB416628B19Fa', // Dharmas address for testing
    usersAddress,
    blockNumber
  )

  if (
    !tokenHolder ||
    !usersAddress ||
    tokenHolderIsLoading ||
    (!tokenHolder.hasBalance && !tokenHolder.hasDelegated)
  ) {
    return null
  }

  const votingPower = tokenHolder.selfDelegated
    ? numberWithCommas(tokenHolder.delegate.delegatedVotes)
    : numberWithCommas(tokenHolder.tokenBalance)

  return (
    <Banner className={classnames('mb-4', className)}>
      <div className='flex justify-between flex-col-reverse sm:flex-row'>
        <h4 className='font-normal mb-0 sm:mb-4'>Total votes</h4>
        {isDataFromBeforeCurrentBlock && (
          <div className='ml-auto sm:ml-0 mb-4 sm:mb-0 flex rounded p-1 w-fit-content h-fit-content bg-tertiary font-bold'>
            <FeatherIcon icon='alert-circle' className='mr-2 my-auto w-4 h-4' />
            Voting power is locked from block #{blockNumber}
          </div>
        )}
      </div>
      <div className='flex flex-col sm:flex-row'>
        <h2
          className={classnames('mb-4 sm:mb-0 leading-none mr-0 sm:mr-4', {
            'opacity-30': !tokenHolder.hasDelegated
          })}
        >
          {votingPower}
        </h2>
        <div className='flex'>
          <NotDelegatedWarning
            isDataFromBeforeCurrentBlock={isDataFromBeforeCurrentBlock}
            tokenHolder={tokenHolder}
          />

          <DelegateTrigger
            tokenHolder={tokenHolder}
            refetchTokenHolderData={refetchTokenHolderData}
            isDataFromBeforeCurrentBlock={isDataFromBeforeCurrentBlock}
          />
        </div>
      </div>
    </Banner>
  )
}

const NotDelegatedWarning = (props) => {
  const { tokenHolder, isDataFromBeforeCurrentBlock } = props

  if (!isDataFromBeforeCurrentBlock || tokenHolder.hasDelegated) {
    return null
  }

  return (
    <div className='flex mb-1 mt-auto mr-2'>
      <PTHint
        tip={
          <div className='my-2 text-xs sm:text-sm break-words max-w-full'>
            This proposal was created prior to you delegating your votes. Therefore you are
            ineligible to vote on this current proposal.
          </div>
        }
      >
        <FeatherIcon icon='alert-circle' className='text-orange w-4 h-4' />
      </PTHint>
    </div>
  )
}

const DelegateTrigger = (props) => {
  const { t } = useTranslation()
  const { tokenHolder, refetchTokenHolderData, isDataFromBeforeCurrentBlock } = props
  const { hasDelegated, selfDelegated } = tokenHolder
  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction(`Self Delegate`, transactions, setTransactions)
  const { data: tokenHolderCurrentData, loading: tokenHolderCurrentDataIsLoading } = useTokenHolder(
    usersAddress
  )
  const tx = transactions?.find((tx) => tx.id === txId)

  const delegateAddress = tokenHolder?.delegate?.id
  const delegateIdentity = useSocialIdentity(delegateAddress)

  const tokenBalanceDisplay = numberWithCommas(tokenHolder.tokenBalance)

  const handleDelegate = async (e) => {
    e.preventDefault()

    const params = [usersAddress]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      DelegateableERC20ABI,
      CONTRACT_ADDRESSES[chainId].GovernanceToken,
      'delegate',
      params,
      refetchTokenHolderData
    )
    setTxId(id)
  }

  if (tx?.completed && !tx?.error && !tx?.cancelled) {
    return (
      <p className='p-2 rounded bg-light-purple-35 text-green my-auto'>
        🎉 Successfully activated your votes 🎉
      </p>
    )
  }

  if (tx?.inWallet && !tx?.cancelled) {
    return (
      <p className='mt-auto text-green opacity-80'>Please confirm the transaction in your wallet</p>
    )
  }

  if (tx?.sent) {
    return <p className='mt-auto text-green opacity-80'>Waiting for confirmations...</p>
  }

  if (!hasDelegated || (tx?.completed && tx?.error)) {
    if (isDataFromBeforeCurrentBlock) {
      if (tokenHolderCurrentData.hasDelegated || tokenHolderCurrentDataIsLoading) {
        return null
      }

      return (
        <button
          type='button'
          className='text-accent-1 underline trans mt-auto'
          onClick={handleDelegate}
        >
          Activate my votes for future proposals
        </button>
      )
    }

    return (
      <button type='button' className='underline trans mt-auto' onClick={handleDelegate}>
        Activate my votes
      </button>
    )
  }

  if (!selfDelegated) {
    const twitterHandle = delegateIdentity?.twitter?.handle
    if (twitterHandle) {
      return (
        <p className='mt-auto'>
          You have <b>{tokenBalanceDisplay}</b> votes delegated to{' '}
          <b>
            <DelegateAddress address={delegateAddress} />
          </b>
        </p>
      )
    }

    return (
      <p className='mt-auto'>
        You have <b>{tokenBalanceDisplay}</b> votes delegated to{' '}
        <b>
          <EtherscanAddressLink
            className='font-bold text-inverse hover:text-accent-1'
            address={delegateAddress}
          >
            <span className='hidden sm:inline'>{delegateAddress}</span>
            <span className='inline sm:hidden'>{shorten(delegateAddress)}</span>
          </EtherscanAddressLink>
        </b>
      </p>
    )
  }

  const delegatedVotesDisplay = numberWithCommas(tokenHolder.delegate.delegatedVotes)

  return (
    <p className='mt-auto'>
      You have <b>{tokenBalanceDisplay}</b> tokens, and <b>{delegatedVotesDisplay}</b> delegated
      votes
    </p>
  )
}

export const DelegateAddress = (props) => {
  const { address } = props
  const delegateIdentity = useSocialIdentity(address)
  const twitterHandle = delegateIdentity?.twitter?.handle

  if (twitterHandle) {
    return (
      <>
        <a
          className='text-inverse hover:text-accent-1 mr-2 trans'
          href={`https://twitter.com/${twitterHandle}`}
          target='_blank'
          rel='noopener'
        >
          {twitterHandle}
          <FeatherIcon icon='external-link' className='inline w-4 h-4 mb-1 ml-1' />
        </a>
        (
        <EtherscanAddressLink className='text-inverse hover:text-accent-1' address={address}>
          {shorten(address)}
        </EtherscanAddressLink>
        )
      </>
    )
  }

  return (
    <EtherscanAddressLink className='text-inverse hover:text-accent-1' address={address}>
      <span className='hidden sm:inline'>{address}</span>
      <span className='inline sm:hidden'>{shorten(address)}</span>
    </EtherscanAddressLink>
  )
}