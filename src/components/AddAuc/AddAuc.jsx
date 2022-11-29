
import swal from 'sweetalert';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import auctionAddress from '../../contracts/AucEngine-contract-address.json'
import auctionArtifact from '../../contracts/AucEngine.json'
export default function AddAuc() {
    const [auction,setAuction] = useState()
    useEffect(() => {
            const connect = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        
            await provider.send("eth_requestAccounts", []);
            const signer =  provider.getSigner();
            const auction = new ethers.Contract(
                auctionAddress.AucEngine,
                auctionArtifact.abi,  
                signer
              )
              setAuction(auction)
            }
            connect()
            
            
    },[])
    
      const create = async () => {
        const price =  ethers.utils.parseEther("3")
         try {
            
            const tx = await auction.createAuction(price,2,'Booom',0)
            await tx.wait()
            swal({
                title: "Success!",
                text: `Auction was added successfully! You can go to Auction List `,
                icon: "success",
                dangerMode: true,
            })

         } catch (e) {
          swal({
            title: "Error!",
            text: `${e.code === 'ACTION_REJECTED' ? `Вы отклонили транзакцию!` : 'Smth getting wrong!'}`,
            icon: "error",
            dangerMode: true,
        })
         }
      }
    return(
        <div>
                <p>hello!!!</p>
                <button onClick={create}>create Auc</button>
        </div>
    )
}