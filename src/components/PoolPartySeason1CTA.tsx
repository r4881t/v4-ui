import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'react-i18next'

import PoolPartySeason1Nft7 from '@assets/images/pool-party-season-1-nft-7.png'

export const PoolPartySeason1CTA = () => {
  const { t } = useTranslation()

  return (
    <div className='block flex items-center p-2 justify-center rounded-lg space-x-2 bg-pt-purple-lightest dark:bg-pt-purple-dark border-2 border-pt-purple-lightest dark:border-pt-purple-dark text-xxs font-semibold mb-10'>
      <div>
        <a target='_blank' href='https://pooltogether.com/pool-party'>
          <img className='w-20 xs:w-10' src={PoolPartySeason1Nft7} />
        </a>
      </div>
      <div className='flex flex-col'>
        <span className='uppercase text-flashy text-xs'>
          {t('poolPartySeasonOne', 'Pool Party Season One')}
        </span>
        <div className='flex flex-col xs:flex-row xs:items-center xs:space-x-1'>
          <span className='text-pt-purple-dark text-opacity-60 dark:text-pt-purple-lighter'>
            {t('getNftsNowSeason1', 'Get PoolTogether NFTs now until May 17th')}
          </span>

          <a
            target='_blank'
            href='https://pooltogether.com/pool-party'
            className='flex items-center underline text-pt-purple dark:text-pt-teal dark:hover:text-white hover:text-pt-purple-light'
          >
            {t('learnMore')} <FeatherIcon icon='external-link' className='w-4 h-4 ml-1' />
          </a>
        </div>
      </div>
    </div>
  )
}
