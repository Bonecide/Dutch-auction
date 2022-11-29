
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import auctionAddress from '../../contracts/AucEngine-contract-address.json'
import auctionArtifact from '../../contracts/AucEngine.json'
import swal from 'sweetalert';
import s from './Auc.module.css'
import { setUser } from '../../store/slices/AuthSlices';
export default function Auc() {
        const account = useSelector((s) => s.auth.user)
        const [auction,setAuction] = useState()
        const [auctions,setAuctions] = useState([])
        const [fake,setFake] = useState(false)

        setInterval(() => {
            setFake(!fake)
        },3000)

        const dispatch = useDispatch()
       
            useEffect(() => {
            const connect = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        
            await provider.send("eth_requestAccounts", []);
            const signer =  provider.getSigner();
            const TimlyAccount = await signer.getAddress()
            const balance = await provider.getBalance(TimlyAccount);
            const balanceInEth = ethers.utils.formatEther(balance);
           
            dispatch( setUser({
                address: TimlyAccount,
                balance : balanceInEth,
            }))
            swal({
                title: "Success!",
                text: "Account was connected successfully!",
                icon: "success",
                dangerMode: true,
            })
            const contract = new ethers.Contract(
                auctionAddress.AucEngine,
                auctionArtifact.abi,
                signer
              );
              setAuction(contract)
            }
            connect()
            window.ethereum.on('accountsChanged', ([newAddress]) => {
                if(newAddress === undefined) {
                  return  dispatch( setUser(null))
                }
                connect()
              })
            
            
    },[])
    useEffect(() => {
        if (auction) {
            getAuctions()
        }
    },[auction])
    const getAuctions = async () => {

         try {
            
            await auction.getAuctions().then((res) => setAuctions(res))
           
           

         } catch (e) {
            console.log(e)
         }
    }
    const getBalance= async () => {
             const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        
            await provider.send("eth_requestAccounts", []);
            const signer =  provider.getSigner();
            const TimlyAccount = await signer.getAddress()
            const balance = await provider.getBalance(TimlyAccount);
            const balanceInEth = ethers.utils.formatEther(balance);
           
            dispatch( setUser({
                balance : balanceInEth,
            }))
    }
    const buy = async (idx,price) => {
            try {
                const tx = await auction.buy(idx,{value : price,gasLimit:100000 })
                await tx.wait()
                swal({
                    title: "Success!",
                    text: `You have bought this item! `,
                    icon: "success",
                    dangerMode: true,
                }).then(() => {
                    getAuctions()
                    getBalance()
                })

            } catch (error) {
                swal({
                    title: "Error!",
                    text: 'smth get wrong',
                    icon: "error",
                    dangerMode: true,
                })
            }
    }
    return(
        <div>
            <p>Hello AUC!</p>
            <div>
                <p>your address is : {account.address}</p>
                <p>your balance is : {account.balance} ETH</p>
            </div>
            <div className={s.Auctions}>
                {auctions.length && auctions.map((i,idx) => {
                   
                  if(!i.stopped) {
                    const elapsed =ethers.BigNumber.from(Math.floor(Date.now() / 1000)).sub(i.startAt)
                    const discount = i.discountRate.mul(elapsed)
                    const newPrice = i.startingPrice.sub(discount)
                    const price = ethers.utils.formatEther(newPrice)

                    return(
                        <div className={s.auc} key={`AuctionN${idx}`}>
                            <p>{i.item}</p>
                            <p>Цена:{price} ETH</p>
                            <button onClick={() => buy(idx,ethers.utils.parseEther(price))}>Купить!</button>
                        </div>
                    )
                  }
                  
                })}
            </div>
        </div>
    )
}