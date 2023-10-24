import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Login() {

    const [show,setShow]=useState(false)

    const [email,setEmail]=useState()
    const [password,setPassword]=useState()

    const handleClick= ()=> setShow(!show)
    const [loading, setloading] = useState(false)
    const navigate=useNavigate()
    const toast=useToast()

    const submitHandler=async()=>{
        setloading(true)
        if(!email || !password){
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

        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                },
            };

            const {data} = await axios.post("/api/user/login",{email,password},config).catch(err=>{
                console.log(err);
            })

            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })

            localStorage.setItem("userInfo",JSON.stringify(data))
            setloading(false)
            navigate('/chats')
            
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
            <FormControl id='email' isRequired>
                <FormLabel>Email
                </FormLabel>
                <Input
                        placeholder='Enter Your Email'
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
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
                            value={password}
                        />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" mr='1' onClick={handleClick}>
                            {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width='100%'
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                onClick={()=>{
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >
                Get User Credentails
            </Button>
        </VStack>
      )
}

export default Login