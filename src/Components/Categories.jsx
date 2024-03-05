import axios from "axios";
import React , { useState, useEffect }from "react";


const Categories = ({ className, onCategoryChange }) => {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL}/categories?_sort=name&_order=asc`)
    .then(response => {
      console.log(response);
      setCategories(response.data);
    }).catch(error => {
      console.error("error",error);
    })
  }, []);

  const selectedCategoryHandle = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    onCategoryChange(selectedCategory);
  };
  
  return (
    <div className={`${className} my-[50px] px-4 py-5 flex flex-col`}>
      {
        categories.map( (item,index) => (
          <div className = 'flex gap-x-3' key={index} >
            <input 
              type="radio" 
              name="categories" 
              id={item.name}
              value= {item.name}
              checked = {selectedCategory === item.name}
              onChange = {selectedCategoryHandle}
              />
            <label htmlFor={item.name}>
              {item.name}
            </label>
          </div>
        ))
      }
    </div>
  );
};

export default Categories;
