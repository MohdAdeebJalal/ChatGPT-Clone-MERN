import React, { useEffect, useState } from  'react';

const App = () => {

  const[message,setMessage] = useState(null)
  const[value,setValue] = useState("")
  const[previousChats,setPreviousChats] = useState([])
  const[currentTitle,setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setCurrentTitle(null)
    setValue("")
    setMessage(null)
  }

  const handleClick = (uniqueTitle) =>{
    setCurrentTitle(uniqueTitle)
    setValue("")
    setMessage(null)

  }
  const getMessages = async() => {
    try {
     const response = await fetch('http://localhost:8000/completions',{
        method: "POST",
        body: JSON.stringify({
          message: value

        }),
        headers: {
          "Content-Type": "application/json"
        }
          
      })
      const data = await response.json()
      setMessage(data.choices[0].message)
      
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }

    if(currentTitle && value && message ){
      setPreviousChats(prevChats => (
        [...prevChats,
          {           
            title: currentTitle ,
            role : "user",          /*for the inputs we gave to the openAI*/
            content : value
            
          },
          {  
            title: currentTitle ,
            role : message.role,    /*for the response we get from the openAI*/
            content : message.content
          }
        ]
      ))
    }

  },[message,currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="bg-[#343541] flex">{/* className app*/ }
      <section className="bg-[#202123] h-screen w-[355px] flex flex-col justify-between items-center">{/* className side-bar*/ }
        <button className="border border-gray-300 border-opacity-20 rounded-[5px] cursor-pointer 
                          w-full p-2.5 m-2.5 bg-transparent font-sans text-white"
                onClick={createNewChat}>
                + New Chat
          </button>
        <ul className="p-2.5 m-2.5 h-full w-full list-none "> {/* className history*/ }
          
            {uniqueTitles?.map((uniqueTitle,index) => <li className="text-white font-sans py-3.5"  onClick={() => handleClick(uniqueTitle)} key={index}>{uniqueTitle}</li> 
          
          )}

        </ul>
        <nav className="border-t-2 border-gray-300 w-full border-opacity-20 p-3.5 ml-4 text-white font-sans">
          <p>Mohd Adeeb Jalaluddin</p>
        </nav>
      </section>
      <section className="h-screen w-full flex flex-col justify-between items-center "> {/* className main*/ }
        <h1 className='font-sans text-[25px] text-white '>Adeeb's GPT</h1>
        <ul className=" w-full h-full p-0 text-[20px] overflow-y-scroll scroll-m-auto "> {/*className = feed*/ }
        {currentChat.map((chatMessage,index) => <li key={index} className='flex bg-[#444654] w-full p-[20px] mx-0 my-5 scroll-m-auto'>
          <p className='min-w-[100px] text-white font-sans'>{chatMessage.role}</p>  {/*className = role*/ }
          <p className='text-gray-200  text-left list-none font-sans'>{chatMessage.content}</p>
        </li>)}

        </ul>

        <div className="full flex flex-col justify-center items-center">
          <div className="relative w-full max-w-[650px]">
            <input className="w-full border-none bg-slate-700 px-[12px] py-[15px] 
                              rounded-[5px] shadow-md focus:outline-none text-[20px] text-white"
                    value = {value}
                    onChange={(e) => setValue(e.target.value)}/> 
              <div id="submit" className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer text-[25px]"  onClick={getMessages}>➢</div>
           </div>
          <p className="p-3.5 text-gray-300 text-[14px]">
            Chat GPT Mar version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>   
        </div>
      </section>      
    </div>
  )
}

export default App
