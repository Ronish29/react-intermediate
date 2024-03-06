import axios from "axios";
import React, { useState, useEffect } from "react";

const Categories = ({ className, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedCategoriesCheckBox, setSelectedCategoriesCheckbox] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("error", error);
      });
  }, [selectedCategoryIndex]);

  const selectedCategoryHandle = (index) => (event) => {
    setSelectedCategoryIndex(index);
    onCategoryChange(index);
  };

  const selectCheckboxChange = (index) => (event) => {
    const isChecked = event.target.checked;
    setSelectedCategoriesCheckbox(prevSelectedCheckbox => {
      if (isChecked) {
        console.log("checkbox value", categories[index].name);
        console.log("Selected item index:", index);
        return [...prevSelectedCheckbox, index];
      } else {

        return prevSelectedCheckbox.filter(selectedIndex => selectedIndex !== index);
      }
    });
  }

  const resetHandle = () => {
    setSelectedCategoryIndex(null);
    onCategoryChange(null);
  };


  return (
    <div className={`${className} my-[50px] flex flex-col`}>
      <button onClick={resetHandle} className="px-4 py-2 bg-blue-400 rounded-md w-fit mx-auto my-4">Reset</button>
      <div className="flex justify-between">
        <div className="px-4 py-5 flex flex-col h-[500px] overflow-y-auto mx-5 ">
          {categories.map((item, index) => (
            <div className='flex gap-x-3' key={index}>
              <input
                type="checkbox"
                name="categories"
                id={item.name}
                checked={selectedCategoriesCheckBox.includes(index)}
                onChange={selectCheckboxChange(index)}
              />
              <label htmlFor={item.name}>
                {item.name}
              </label>
            </div>
          ))}
        </div>
        <div className="px-4 py-5 flex flex-col h-[500px] overflow-y-auto mx-5 ">
          {categories.map((item, index) => (
            <div className='flex gap-x-3' key={index}>
              <input
                type="radio"
                name="categories"
                id={item.name}
                checked={selectedCategoryIndex === index}
                onChange={selectedCategoryHandle(index)}
              />
              <label htmlFor={item.name}>
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </div>


      


    </div>

  );
};

export default Categories;
