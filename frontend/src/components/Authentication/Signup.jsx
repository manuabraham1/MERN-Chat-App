import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import firebase from '../../firebase/config'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'

function Signup() {

    const [show,setShow]=useState(false)

    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [confirmpassword,setConfirmPassword]=useState()
    const [password,setPassword]=useState()
    const [pic,setPic]=useState()
    const [loading, setloading] = useState(false)
    const toast=useToast()
    const navigate=useNavigate()

    const handleClick= ()=> setShow(!show)

    const postDetails=(pics)=>{
        setloading(true)
        if(pics===undefined){
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              })
            return;
        }

        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const storage=getStorage()
            const storageRef=ref(storage,`/profile-images/${pics.name}`)

            uploadBytes(storageRef,pics).then((snapshot)=>{
                getDownloadURL(snapshot.ref).then((url)=>{
                    setPic(url.toString())
                    console.log(url);
                    setloading(false)
                })
            }).catch((err)=>{
                console.log(err);
                setloading(false)
            })

        }else{
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setloading(false)
            return;
            
        }
    }

    const submitHandler=async()=>{
        setloading(true)
        if(!name || !email || !password || !confirmpassword){
            toast({
                title: 'Please fill all Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setloading(false)
            return
        }

        if(password !== confirmpassword){
            toast({
                title: 'Passwords Do not Match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setloading(false)
            return
        }

        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                },
            };

            const {data} = await axios.post("/api/user",{name,email,password,pic},config).catch(err=>{
                console.log(err);
            })

            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })

            localStorage.setItem("userInfo",JSON.stringify(data))
            setloading(false)
            navigate('/chat')
            
        }catch(error){
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setloading(false)
        }
    }

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name
            </FormLabel>
            <Input
                    placeholder='Enter Your Name'
                    onChange={(e)=>setName(e.target.value)}
                />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email
            </FormLabel>
            <Input
                    placeholder='Enter Your Email'
                    onChange={(e)=>setEmail(e.target.value)}
                />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password
            </FormLabel>
            <InputGroup>
                <Input
                        type={show? 'text':'password'}
                        placeholder='Enter Your Password'
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                <InputRightElement>
                    <Button h="1.75rem" size="sm" mr='1' onClick={handleClick}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password
            </FormLabel>
            <InputGroup>
                <Input
                        type={show? 'text':'password'}
                        placeholder='Enter Your Confirm Password'
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                <InputRightElement>
                    <Button h="1.75rem" size="sm" mr='1' onClick={handleClick}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload Your Picture
            </FormLabel>
            <Input
                    type='file'
                    p={1.5}
                    accept='images/*'
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
        </FormControl>
        <Button
            colorScheme='blue'
            width='100%'
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup