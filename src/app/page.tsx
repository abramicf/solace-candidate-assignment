"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

import { formatPhoneNumber } from "./utils";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 2,
    offset: 0
  });

  const observer = useRef<IntersectionObserver>();
  const lastAdvocateElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreAdvocates();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, pagination]);

  const fetchAdvocates = async (offset = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/advocates?limit=${pagination.limit}&offset=${offset}`);
      const { data, pagination: paginationInfo } = await response.json();
      
      if (offset === 0) {
        setAdvocates(data);
        setFilteredAdvocates(data);
      } else {
        setAdvocates(prev => [...prev, ...data]);
        setFilteredAdvocates(prev => [...prev, ...data]);
      }
      
      setPagination(paginationInfo);
      setHasMore(data.length > 0 && (offset + data.length) < paginationInfo.total);
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreAdvocates = () => {
    if (!loading && hasMore) {
      fetchAdvocates(pagination.offset + pagination.limit);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = searchTerm;
    }
    
    setButtonDisabled(false);
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    const searchTermElement = document.getElementById("search-term");
    const filterInput = document.getElementById("filter-input") as HTMLInputElement;
    
    if (searchTermElement) {
      searchTermElement.innerHTML = '';
    }
    if (filterInput) {
      filterInput.value = '';
    }
    
    setButtonDisabled(true);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-5xl font-bold text-green-900">Solace Advocates</h1>
      <br />
      <br />
      <div>
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
            {filteredAdvocates.map((advocate, index) => {
              const isLastElement = index === filteredAdvocates.length - 1;
              return (
                <tr
                  key={advocate.id}
                  ref={isLastElement ? lastAdvocateElementRef : null}
                  className="odd:bg-white odd:dark:bg-gray-200 even:dark:bg-gray-100 border-b dark:border-gray-700 border-gray-200">
                  <td className="px-6 py-4">{advocate.firstName}</td>
                  <td className="px-6 py-4">{advocate.lastName}</td>
                  <td className="px-6 py-4">{advocate.city}</td>
                  <td className="px-6 py-4">{advocate.degree}</td>
                  <td className="px-6 py-4">
                    {advocate.specialties.map((s) => (
                      <div key={uuidv4()}>{s}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4">{formatPhoneNumber(advocate.phoneNumber.toString())}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading more advocates...</p>
          </div>
        )}
      </div>
    </main>
  );
}
