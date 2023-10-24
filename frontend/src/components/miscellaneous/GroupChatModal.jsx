import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { user, chats, setChats } = ChatState()

    const handleDelete =(delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=> sel._id !== delUser._id))
    }

    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"
            })
            return
        }

        setSelectedUsers([...selectedUsers,userToAdd])
    }

    const handleSearch= async(query)=>{
        setSearch(query)
        if(!query){
            toast({
                title: 'Please enter something to search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top-left"
            })
            return
        }

        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }

            const {data}=await axios.get(`/api/user?search=${search}`,config)
            setSearchResult(data)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description:'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom-left"
            })
        }
    }

    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title: 'Please fill all details',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"
            })
            return
        }

        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }

            const {data}=await axios.post('/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            },config)
            
            setChats([data,...chats])
            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })

        } catch (error) {
            toast({
                title: 'Failed to Create the Chat',
                description:error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })

        }
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                    Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >        
                        <FormControl>
                            <Input 
                                placeholder='Chat Name' 
                                mb={3}
                                onChange={(e)=>setGroupChatName(e.target.value)}
                                />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Piyush Jane'
                                mb={1}
                                onChange={(e)=>handleSearch(e.target.value)}/>
                        </FormControl>
                        {/* selected users */}
                        <Box
                            display="flex"
                            w="100%"
                            flexWrap="wrap">
                            {selectedUsers.map((u)=>(
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={()=> handleDelete(u)}/>
                            ))}
                        </Box>
                        
                        {/* render searched users */}
                        {loading? <Spinner/>: (
                            searchResult?.slice(0,4).map(user=>(
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>handleGroup(user)}/>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal