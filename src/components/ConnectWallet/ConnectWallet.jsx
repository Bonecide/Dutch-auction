import { ethers } from 'ethers'
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setUser } from '../../store/slices/AuthSlices';
import { useNavigate } from 'react-router-dom';
export default function ConnectWallet() {
    const account = useSelector((s) => s.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const connect = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        try {
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
            }).then((res) => {
                if(res) {
                        dispatch(setAuth())
                        navigate('/')
                }
            })
        } catch (error) {
            swal({
                title: "Error!",
                text: "Something get Wrong!",
                icon: "error",
                dangerMode: true,
            })
        }   
        window.ethereum.on('accountsChanged', ([newAddress]) => {
            if(newAddress === undefined) {
              return  dispatch( setUser(null))
            }
            connect()
          })
    }
    return(
        <div>
               {!account ? (
                 <button onClick={connect}>Connect</button>
               ) : (
                <p>your account is: {account.address} <br />
                    your balance : {account.balance}
                </p>
               )}
        </div>
    )
}