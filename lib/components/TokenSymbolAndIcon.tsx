import React from 'react'
import { TokenIcon } from '@pooltogether/react-components'
import classNames from 'classnames'

interface TokenSymbolAndIconProps {
  className?: string
  chainId: number
  address: string
  symbol: string
}

export const TokenSymbolAndIcon = (props: TokenSymbolAndIconProps) => {
  const { className, chainId, address, symbol } = props
  return (
    <div className={classNames('flex', className)}>
      <TokenIcon className='mr-2 my-auto' chainId={chainId} address={address} />
      <span className='my-auto'>{symbol}</span>
    </div>
  )
}