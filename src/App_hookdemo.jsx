import React, { useState,useEffect,useRef } from "react";

//模拟数据接口，3秒后返回数据
const getData = (query) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("getData", query);
            resolve([7, 8, 9]);
        }, 3000);
    });
};

function App() {
    const [data, setData] = useState([1, 2, 3, 4, 5]); // 初始化数据 后面是初始数据
    const [query, setQuery] = useState(""); // 初始化数据 后面是初始数据
    const [count, setCount] = useState(0);
    const countRef = useRef(count);
    countRef.current = count;
    //useEffect的第二个参数传入空数组，表示只执行一次
    // useEffect(() => {
    //     // getData().then((res) => {
    //     //     setData(res);
    //     //     console.log(res);
    //     // });
    //     console.log("useEffect", data);
    // }, []);
    // useEffect(() => {(
    //     async () => {
    //         const res = await getData(query);
    //         setData(res);
    //         console.log(res);
    //     }
    // )()}, [query]);//这样写也可以 第二个参数传入空数组，表示当更新的值为空数组时候跳过本次effect的执行卸载副作用,所以本次只执行一次
    //进入页面之后的三秒打印定时器，如果不用ref用第三个参数为count每次都会执行清除定时器的操作，实际上是停止点击按钮后的三秒执行，并不是进入页面后的三秒i执行，
    //实际上是闭包这个是useEffect带来的闭包，导致一个作用域问题，每一次执行都是独立作用域
    // useEffect(() => {
    //    let timer =  setTimeout(() => {
    //       console.log('点击次数: ' + countRef.current);
    //     }, 3000);
    //     return () => {
    //         console.log("清除定时器");
    //         clearTimeout(timer)
    //     }
    //   },[]);
    useEffect(() => {
        setTimeout(() => {
            console.log("点击次数: " + count);
        }, 3000);
    });

    return (
        <div>
            {
                data.map((item, index) => {
                    return <div key={index}>{item}</div>
                })
            }
            <input type="text" value={query} onChange={(e) => { setQuery(e.target.value) }} />
            <button onClick={() => setCount(count + 1)}>点击{count}次</button>
        </div>
    )
}

export default App;