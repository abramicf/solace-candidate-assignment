"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;
    setButtonDisabled(false)
    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.toString().includes(searchTerm) ||
        advocate.specialties.toString().toLowerCase().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) // includes is meant for strings or arrays - this change keeps years of experience in the filter
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    document.getElementById("search-term").innerHTML = '';
    document.getElementById("filter-input").value = '';
    setButtonDisabled(true)
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-5xl font-bold text-green-900">Solace Advocates</h1>
      <br />
      <br />
      <div>
        {/* <p>Search</p> */}
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input 
          id="filter-input"
          className="text-3xl bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md"
          onChange={onChange}
        />
        <button 
          disabled={buttonDisabled}
          className={
            "text-3xl mx-4 text-white px-4 rounded-md " 
            + (!buttonDisabled ? "bg-green-900 hover:bg-green-950" : "bg-green-800")
          }
          onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-lg text-left rtl:text-right text-gray-800">
          <thead className="text-lg dark:bg-green-900 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">First Name</th>
              <th scope="col" className="px-6 py-3">Last Name</th>
              <th scope="col" className="px-6 py-3">City</th>
              <th scope="col" className="px-6 py-3">Degree</th>
              <th scope="col" className="px-6 py-3">Specialties</th>
              <th scope="col" className="px-6 py-3">Years of Experience</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr className="odd:bg-white odd:dark:bg-gray-200 even:dark:bg-gray-100 border-b dark:border-gray-700 border-gray-200">
                  <td className="px-6 py-4">{advocate.firstName}</td>
                  <td className="px-6 py-4">{advocate.lastName}</td>
                  <td className="px-6 py-4">{advocate.city}</td>
                  <td className="px-6 py-4">{advocate.degree}</td>
                  <td className="px-6 py-4">
                    {advocate.specialties.map((s) => (
                      <div>{s}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
