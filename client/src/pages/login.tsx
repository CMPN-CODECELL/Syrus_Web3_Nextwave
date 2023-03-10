// type imports
import type { NextPage } from 'next'

// named imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import { AuthLayout } from '../layouts'
import {
  useAddress,
  useClaimNFT,
  useContract,
  useDisconnect,
  useMetamask,
  useOwnedNFTs
} from '@thirdweb-dev/react'

// default imports
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'

const Login: NextPage = () => {
  // next router
  const router = useRouter()

  // web3 auth hooks
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()
  const address = useAddress()

  // states for the current NFT chosen to be minted
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // check if user owns any IRC 1155 NFTs
  const { contract } = useContract('0x863841449a5bB0011B37B5e94504bFFB909Adcc0')
  const { data: ownedNFTs } = useOwnedNFTs(contract, address)
  const hasAccess = ownedNFTs?.length! > 0

  // claim NFT hook
  const { mutateAsync: claim, isLoading } = useClaimNFT(contract)

  // handler function for claiming NFT
  const handleMintNFT = async () => {
    try {
      await claim({ to: address, tokenId: currentIndex, quantity: 1 })

      router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthLayout>
      <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>

        {/* left side */}
        <aside className='bg-gradient-to-br from-emerald-600 to-indigo-400 flex flex-col items-center justify-center py-2 lg:min-h-screen lg:col-span-4'>
          <div className='bg-gradient-to-br from-amber-400 to-rose-400 px-4 py-3 rounded-xl'>
            <Image
              src='/logo.png'
              alt='ChainBridge Access NFT'
              width={200}
              height={200}
            />
          </div>

          <div className='text-center p-5 space-y-2'>
            <h1 className='text-3xl font-bold text-white'>ChainBridge Access</h1>
            <h2 className='text-lg text-gray-200'>An ERC 1155 Token that provides access to the ChainBridge Portal</h2>
          </div>
        </aside>

        {/* right side */}
        <section className='flex flex-1 flex-col p-12 lg:col-span-6'>
          
          {/* header section */}
          <header className='flex items-center justify-between'>
            <h2 className='w-52 cursor-pointer text-xl font-extralight sm:w-96 uppercase'>
              The <span className='font-bold underline decoration-indigo-400/70'>ChainBridge</span> Portal Access
            </h2>

            <div className='space-x-2'>
              {hasAccess ? (
                <Link
                  href='/dashboard'
                  className='rounded-full bg-emerald-600 hover:bg-emerald-700 animate text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-sm flex items-center space-x-1'
                >
                  <p>Dashboard</p>
                  <ArrowUpRightIcon className='h-4 w-4 ml-1' />
                </Link>
              ) : (
                <button
                  onClick={() => address ? disconnect() : connectWithMetamask()}
                  className='rounded-full bg-indigo-500 hover:bg-indigo-600 animate text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-sm'
                >
                  {address ? 'Sign Out' : 'Sign In'}
                </button>
              )}
              </div>
          </header>

          <hr className='my-2 border-[0.5px]' />

          {/* user wallet address */}
          {address ? (
            <p className='text-center text-sm text-emerald-600 mt-4'>
              Your logged in with wallet: <span className='font-semibold'>{address.substring(0, 4)}...{address.substring(address.length - 4)}</span>
            </p>
          ) : (
            <p className='text-center text-sm text-emerald-600 mt-4'>
              You have not connected your wallet.
            </p>
          )}

          {/* nft details */}
          <div className='flex mt-8 flex-1 flex-col items-center space-y-6 lg:justify-center'>
            <div className='flex items-center space-x-6'>
              <div className='flex flex-col'>
                <label htmlFor='tokenIndex' className='text-sm mb-1'>
                  Select Your Role
                </label>
                <select
                  name='tokenIndex'
                  id='tokenIndex'
                  onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
                  className='login-input'
                >
                  <option value={0}>Patient</option>
                  <option value={1}>Healthcare Provider</option>
                </select>
              </div>

              <Image
                src={currentIndex === 0 ? '/cb_patient.png' : '/cb_admin.png'}
                alt='ChainBridge Patient NFT'
                width={200}
                height={200}
              />
            </div>

            <h3 className='text-3xl font-semibold lg:text-4xl lg:font-bold text-gray-600'>
              ChainBridge Special NFT
            </h3>

            <p className='text-indigo-400 -mt-2 text-center'>
              Get access to the ChainBridge Portal by minting a special NFT.
            </p>
          </div>

          {/* loader section */}
          {address && isLoading && (
            <div className='flex items-center justify-center'>
              <Image
                src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'
                alt='Loading...'
                width={200}
                height={200}
              />
            </div>
          )}

          {/* mint button */}
          <button
            disabled={!address || isLoading || hasAccess}
            onClick={() => handleMintNFT()}
            className='h-14 bg-emerald-600 hover:bg-emerald-700 animate w-full text-white rounded-full mt-10 font-bold disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {
              hasAccess ? <span>You have already minted</span> :
              <span>Claim &#40;ERC 1155&#41; NFT</span>
            }
          </button>

        </section>

      </div>
    </AuthLayout>
  )
}

export default Login
