import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { FaCcPaypal, FaEthereum, FaRegCopy, FaBtc } from 'react-icons/fa'
import CopyToClipboard from 'react-copy-to-clipboard'

export const DonateComponent = () => {
  const [ethClicked, setEthClicked] = useState(false)
  const [btcClicked, setBtcClicked] = useState(false)
  const handleEthClick = e => {
    e.preventDefault()
    setEthClicked(true)
    setBtcClicked(false)
  }
  const handleBtcClick = e => {
    e.preventDefault()
    setBtcClicked(true)
    setEthClicked(false)
  }
  return (
    <>
      <div className="container pt-4">
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 card py-3">
            <div className="row justify-content-center d-print-none">
              <div className="col mx-2">
                <DisplayWallet ethActive={ethClicked} btcActive={btcClicked} />
              </div>
            </div>
            <div className="row d-flex justify-content-center d-print-none">
              <div className="btn-group btn-group-lg" role="group" aria-label="Donate">
                <div className="btn-group mr-2" role="group" aria-label="Donate options">
                  <IconContext.Provider value={{ size: '2.2em' }}>
                    <PayPalButton />
                    <EthButton handleClick={handleEthClick} />
                    <BtcButton handleClick={handleBtcClick} />
                  </IconContext.Provider>
                </div>
              </div>
            </div>

            <small className="text-center mt-3">
              Creating this tool takes a lot of time and effort.
              <br />
              If you'd like to thank me, buy me a beer!
            </small>
          </div>
        </div>
      </div>
    </>
  )
}

const DisplayWallet = ({ ethActive, btcActive }: { ethActive: boolean; btcActive: boolean }) => {
  const [copied, setCopied] = useState(false)
  const handleSetCopied = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }
  const ethWallet = '0x0656E46AA9dFbB379887dD371e6f078AcE472E33'
  const btcWallet = '3JqXcy5qdoNq4DDRsJRfsFeozuhkapgBR4'
  const currentWallet = ethActive ? ethWallet : btcWallet
  const isHidden = !ethActive && !btcActive

  return (
    <div className={`row ${isHidden ? `d-none` : `d-flex mt-1 mb-3`} justify-content-center`}>
      <small className="text-muted">Wallet Address</small>
      <WalletCopyInput currentWallet={currentWallet} setCopied={handleSetCopied} />
      {copied && <span className="text-info">Copied to clipboard.</span>}
    </div>
  )
}

const WalletCopyInput = ({ currentWallet, setCopied }: { currentWallet: string; setCopied: () => void }) => {
  return (
    <div className="input-group">
      <input type="text" className="form-control" aria-label="Copy to clipboard" value={currentWallet} disabled />
      <div className="input-group-append">
        <CopyToClipboard text={currentWallet} onCopy={setCopied}>
          <button className="btn btn-light">
            <FaRegCopy />
          </button>
        </CopyToClipboard>
      </div>
    </div>
  )
}

const EthButton = ({ handleClick }: { handleClick: (e: any) => void }) => {
  return (
    <>
      <FaEthereum onClick={handleClick} className={'mx-2'} />
    </>
  )
}

const BtcButton = ({ handleClick }: { handleClick: (e: any) => void }) => {
  return (
    <>
      <FaBtc onClick={handleClick} className={'mx-2'} />
    </>
  )
}

const PayPalButton = () => {
  const handleClick = e => {
    e.preventDefault()
    window.open('https://paypal.me/daviseford')
  }
  return (
    <>
      <FaCcPaypal onClick={handleClick} className={'mx-2'} />
    </>
  )
}