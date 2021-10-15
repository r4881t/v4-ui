import { PrizeDistribution } from '@pooltogether/v4-js-client'
import { BigNumber } from '@ethersproject/bignumber'

export const DECIMALS_FOR_DISTRIBUTION_TIERS = '9'

const END_TIMESTAMP_OFFSET = 15 * 60 // 15 minutes
const EXPIRY_DURATION = 60 * 86400 // 2 months

const BIT_RANGE_SIZE = 2
const CARDINALITY = 2

// export const TSUNAMI_USDC_PRIZE_DISTRIBUTION: PrizeDistribution = Object.freeze({
export const TSUNAMI_USDC_PRIZE_DISTRIBUTION = Object.freeze({
  bitRangeSize: BIT_RANGE_SIZE,
  tiers: [166889185, 0, 0, 320427236, 0, 512683578, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maxPicksPerUser: 2,
  matchCardinality: CARDINALITY,
  numberOfPicks: (2 ** BIT_RANGE_SIZE) ** CARDINALITY,
  prize: BigNumber.from('14980000000'),
  endTimestampOffset: END_TIMESTAMP_OFFSET,
  expiryDuration: EXPIRY_DURATION
})
