import { GuestbookNearContract } from "@/config"
import dayjs from "dayjs"
import { NearContext } from "@/context";

const { useMemo, useState, useRef, useContext } = require("react")

export const useBooks = ()=> {
  const [data, setData] = useState([])
  const [skeleton, setSkeleton] = useState([1])
  const { signedAccountId, wallet } = useContext(NearContext);
  const pageSize = 10
  const config = useRef({
    from_index: 0
  })

  const loadData = async ({ more })=> {
    if (!more) {
      config.current.from_index = 0
      setData([])
    }
    setSkeleton([1])
    try {
      console.log("signedAccountId", signedAccountId)
      const res = await wallet.viewMethod({
        contractId: GuestbookNearContract,
        method: "get_books",
        args: { from_index: String(config.current.from_index), limit: `${pageSize}`, accountId: signedAccountId },
      })
      let newData = res.data
      if (newData.length > 0) {
        config.current.from_index += newData.length
      }
      if (more) {
        newData = [...data, ...res.data]
      }
      setData(newData)
      setSkeleton([])
      
    } catch (error) {
      console.log("res", error)
      setSkeleton([])
    }
  }

  const books = useMemo(()=>{
  return (
    <div class="w-80 flex flex-col items-center">
      <div class="from-neutral-800 font-bold">我的历史笔记</div>
      <div class="mt-2">
        {data.map((item, index)=>{
          return (
            <div key={`data_${index}`} class="border border-light-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto min-w-80 mb-4">
              <div class="w-30 h-5 text-[14px]">{ dayjs(parseInt(item.timestamp)).format('YYYY-MM-DD HH:mm')}</div>
              <div class="w-full bg-blue-400 mt-4">
                {item.content}
              </div>
            </div>
          )
        })}
        {
          data.length === 0 && skeleton.length === 0 && <div className="w-full text-center text-purple-500">暂无数据</div>
        }
        {skeleton.map((i, index)=>{
          return (
          <div key={`skeleton_${index}`} class="border border-light-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto min-w-80 mb-4">
            <div class="skeleton w-20 h-5 bg-gray-300 animate-pulse rounded-md"></div>
            <div class="skeleton w-full h-20 bg-blue-400 animate-pulse mt-4 rounded-md"></div>
        </div>)
        })}
        {skeleton.length === 0 && <div class="mt-5 w-full text-center cursor-pointer hover:text-fuchsia-500" onClick={()=>{
          loadData({ more: true })
        }}>点击加载更多</div>}
      </div>
    </div>)
  }, [data, skeleton])

  return { books, loadData }
}