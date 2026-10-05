import {useEffect, useState} from "react";


function Count() {

    const [count, setCount] = useState(0);

    useEffect (() => {

      console.log(`Count đã thay đổi: ${count}`)
   }, [count]);


    function handleChange(){

        setCount(count => count + 1);

    }

    function handleChange2(){

        setCount(count => count - 1);
    }

    function handleReset(){

        setCount(0);
    }

  return (
    <div>
      <h1>Count Page</h1>
      <h1>{count}</h1>

      <button onClick={handleChange}> Tăng </button>
      <button onClick={handleReset}>Reset</button>
      <button  onClick={handleChange2}> Giảm </button>
    </div>
  );
}

export default Count;