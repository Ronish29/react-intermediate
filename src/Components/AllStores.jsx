import axios from "axios";
import React, { useState, useEffect } from "react";
import { alphabets } from '../alphabets'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const AllStores = ({ className, selectedCategory }) => {
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState("publish");
  const [selectedSort, setSelectedSort] = useState("name");
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const [cashbackChecked, setCashbackChecked] = useState(false);
  const [promotedChecked, setPromotedChecked] = useState(false);
  const [shareChecked, setShareChecked] = useState(false);
  const [likedStores, setLikedStores] = useState([]);


  useEffect(() => {
    const storedLikedStores = localStorage.getItem('likedStores');
    if (storedLikedStores) {
      setLikedStores(JSON.parse(storedLikedStores));
    }
    let apiUrl = `${process.env.REACT_APP_BASE_URL}/stores`;

    const queryParams = [];

    if (selectedCategory) {
      queryParams.push(`cats=${selectedCategory}`);
    }
    if (cashbackChecked) {
      queryParams.push('cashback_enabled=1');
    }
    if (promotedChecked) {
      queryParams.push('is_promoted=1');
    }
    if (shareChecked) {
      queryParams.push('is_shareable=1');
    }
    if (selectedStatus) {
      queryParams.push(`status=${selectedStatus}`);
    }
    if (selectedAlphabet !== null) {
      const selectedChar = alphabets[selectedAlphabet].char.toLowerCase();
      queryParams.push(`name_like=^${selectedChar}`);
    }

    if (storeName.trim() !== '') {
      queryParams.push(`name_like=${storeName.trim()}`);
    }

    if (selectedSort) {
      const [sortField, sortOrder] = selectedSort.split(':');
      queryParams.push(`_sort=${sortField}`);
      if (sortOrder) {
        queryParams.push(`_order=${sortOrder}`);
      }
    }


    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join('&')}`;
    }

    axios.get(apiUrl)
      .then(response => {
        console.log(response);
        setStores(response.data);
      })
      .catch(error => {
        console.error("error", error);
      });
  }, [selectedCategory, selectedStatus, selectedSort, cashbackChecked, promotedChecked, shareChecked, selectedAlphabet, storeName]);

  const storeNameHandle = (e) => {
    setStoreName(e.target.value);
    console.log(e.target.value);
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    console.log(e.target.value)
  };

  const handleSortChange = (e) => {
    const selectedSortValue = e.target.value;
    let sortField = '';
    let sortOrder = '';

    switch (selectedSortValue) {
      case 'name':
        sortField = 'name';
        break;
      case 'featured':
        sortField = 'featured';
        sortOrder = 'desc';
        break;
      case 'popularity':
        sortField = 'clicks';
        sortOrder = 'desc';
        break;
      case 'cashback':
        sortField = 'amount_type,cashback_amount'
        sortOrder = 'desc'
        break;
      default:
        break;
    }

    const queryParams = [];
    if (sortField) {
      queryParams.push(`_sort=${sortField}`);
    }
    if (sortOrder) {
      queryParams.push(`_order=${sortOrder}`);
    }


    setSelectedSort(selectedSortValue);
  };



  const handleAlphabet = (index) => {
    setSelectedAlphabet(index);
    console.log(index);
    const selectedChar = alphabets[index].char;
    console.log(selectedChar);
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case 'cashback':
        setCashbackChecked(checked);
        break;
      case 'promoted':
        setPromotedChecked(checked);
        break;
      case 'share':
        setShareChecked(checked);
        break;
      default:
        break;
    }
  };

  const handleLikeClick = (index) => {
    setLikedStores(prevLikedStores => {
      const alreadyLiked = prevLikedStores.includes(index);
      const updatedLikedStores = alreadyLiked
        ? prevLikedStores.filter((storeIndex) => storeIndex !== index)
        : [...prevLikedStores, index];


      localStorage.setItem('likedStores', JSON.stringify(updatedLikedStores));

      return updatedLikedStores;
    });
  };


  return (
    <div className={`my-[50px] ${className}`}>
      <div className="flex justify-between my-4">
        <select name="status" id="status" className="border rounded-md"
          value={selectedStatus}
          onChange={handleStatusChange}>
          <option value="publish">Active</option>
          <option value="draft">Coming soon</option>
          <option value="trash">Discontinued</option>
        </select>

        <input
          type="text"
          onChange={storeNameHandle}
          value={storeName}
          placeholder="Search by store name"
          className="border rounded-md"
        />

        <div className="flex item-center">
          <label htmlFor="sort">Sort By</label>
          <select name="sort" id="sort"
            value={selectedSort}
            onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="featured">Featured</option>
            <option value="popularity">Popularity</option>
            <option value="cashback">Cashback</option>
          </select>
        </div>
      </div>

      <div className="flex gap-x-3 my-4">
        <input
          type="checkbox"
          id="cashback"
          name="cashback"
          checked={cashbackChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="cashback">Show Stores with Cashback</label>

        <input
          type="checkbox"
          id="promoted"
          name="promoted"
          checked={promotedChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="promoted">Promoted</label>

        <input
          type="checkbox"
          id="share"
          name="share"
          checked={shareChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="share">Share & Earn</label>
      </div>



      <ul className="flex gap-x-3 my-4">
        {alphabets.map((alphabet, index) => (
          <li key={index}
            className={`cursor-pointer hover:text-red-500 ${selectedAlphabet === index ? 'font-bold text-red-500' : 'font-normal'}`}
            onClick={() => handleAlphabet(index)}
          >{alphabet.char}</li>
        ))}
      </ul>

      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-5">
        {stores.map((item, index) => (
          <div className='flex flex-col gap-y-2 justify-between relative h-[125px] items-center border rounded-md cursor-pointer px-4' key={index}
            onClick={() => {
              if (item.homepage) {
                window.open(item.homepage, '_blank');
              }
            }}
          >
            <img src={item.logo} alt="item_logo" className="rounded-full aspect-square w-10" />
            <span className="absolute right-2 top-1" onClick={(e) => {
              e.stopPropagation();
              handleLikeClick(index);
            }}>
              {likedStores.includes(index) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </span>
            <p className="text-sm">{item.name}</p>
            {cashbackChecked ? (
              <>
                {item.cashback_enabled ? (
                  <>
                    {item.amount_type === "percent" ? (
                      <p className="text-sm">{`${item.rate_type} ${item.cashback_amount.toFixed(2)}% Cashback`}</p>
                    ) : (
                      <p className="text-sm">{`${item.rate_type} $ ${item.cashback_amount.toFixed(2)} Cashback`}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm">No cashback available</p>
                )}
              </>
            ) : (
              <p className="text-sm">Cashback not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStores;
