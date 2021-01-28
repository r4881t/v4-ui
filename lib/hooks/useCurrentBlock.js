import { useContext, useEffect, useState } from 'react'
import { useInterval } from 'beautiful-react-hooks'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { SECONDS_PER_BLOCK } from 'lib/constants'
import { atom, useAtom } from 'jotai'

const currentBlockAtom = atom({})

export function useCurrentBlock () {
  const { provider, chainId } = useContext(AuthControllerContext)
  const [currentBlock, setCurrentBlock] = useAtom(currentBlockAtom)

  useEffect(() => {
    const getBlockNumber = async () => {
      if (provider?.getBlockNumber) {
        const blockNumber = await provider.getBlockNumber()

        const block = await provider.getBlock(blockNumber)
        setCurrentBlock({
          ...block,
          blockNumber
        })
      }
    }
    getBlockNumber()
  }, [provider, chainId])

  return currentBlock
}