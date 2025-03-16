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
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [loading, hasMore]);

  const fetchAdvocates = async (offset = 0, search = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: offset.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/advocates?${params}`);
      const { data, pagination: paginationInfo } = await response.json();
      
      if (offset === 0) {
        setAdvocates(data);
      } else {
        setAdvocates(prev => [...prev, ...data]);
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

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdvocates(0, searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = newSearchTerm;
    }
    
    setButtonDisabled(false);
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
    setSearchTerm("");
    fetchAdvocates(0, "");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-5xl font-mollie text-primary-500 mb-8">Solace Advocates</h1>
      <p className="font-mollie">
          Searching for: <span id="search-term"></span>
      </p>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="text-3xl">
          <input
            id="filter-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
            onChange={onChange}
          />
          <button
            disabled={buttonDisabled}
            className={
              "mx-4 text-white px-4 rounded-md bg-secondary-500 "
              + (!buttonDisabled ? "hover:bg-secondary-700" : "opacity-50")
            }
            onClick={onClick}>
              Reset Search
          </button>
        </div>
        <div className="font-mollie text-3xl text-primary-500">Total: {pagination.total}</div>
      </div>
      <br />
      <br />
      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-lg text-left rtl:text-right text-gray-800">
          <thead className="text-lg bg-neutral-200 text-primary-800 font-mollie">
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
            {advocates.map((advocate, index) => {
              const isLastElement = index === advocates.length - 1;
              return (
                <tr
                  key={advocate.id}
                  ref={isLastElement ? lastAdvocateElementRef : null}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50">
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
