const Form = ({ onSubmit, onRefresh })=> {
  return (
  <form class="flex-col  p-2 flex items-center" onSubmit={onSubmit}>
    <div class="flex-col">
      <div class=" font-black">
        日记内容
      </div>
      <div class="mt-5 border-gray-400 border-t border-r border-b border-l rounded p-1">
        <textarea id="content" class=" bg-transparent border-none focus:border-none w-60 focus: outline-none" placeholder="输入日记内容"/>
      </div>
      <div class="flex flex-row items-center justify-center mt-4">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          保存
        </button>
        <button type={"button"} class="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-2 px-4 rounded ml-10" onClick={()=>onRefresh?.()}>刷新</button>
      </div>
    </div>
  </form>)
}

export default Form