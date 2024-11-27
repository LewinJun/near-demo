import { useBooks } from "@/components/Books"
import Form from "@/components/Form"
import { NearContext } from "@/context";
import { useContext } from "react";

const MyBook = ()=> {
  const { books, loadData } = useBooks()
  const { wallet } = useContext(NearContext);
  const submit = async (e)=> {
    e.preventDefault();
    const { content } = e.target.elements
    console.log("content:", content.value)
    const res = await wallet.callMethod({ method: 'set_book', args: { content: content.value } })
    console.log("res", res)
    loadData({ more: false })
  }

  return (
  <div class="flex-1 w-full flex-col justify-center">
    <div className="flex row items-center justify-center w-full">
      <div class="font-black mr-5">我的笔记</div>
      <div className="relative h-3 w-3">
        <span class="flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
      </div>
    </div>
    <div class="flex-col flex items-center">
      <Form onSubmit={(e)=>{
        submit(e)
      }} onRefresh={()=>{
        loadData({ more: false })
      }} />
      { books }
    </div>
  </div>)
}

export default MyBook