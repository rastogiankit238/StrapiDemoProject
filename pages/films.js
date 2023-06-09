import React,{useState} from 'react'
import Layout from '@/components/Layout'
import { fetcher } from '../lib/api';
import Films from '@/components/Films';
import useSWR from 'swr';
import { useFetchUser } from '@/lib/authContext';

const FilmsPageLists = ({films,navData}) => {
const {user,loading}=useFetchUser();
const [pageIndex, setPageIndex] = useState(1);
const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?pagination[page]=${pageIndex}&pagination[pageSize]=5`,
    fetcher,
    {
        fallbackData: films,
    }
    );
  return (
    <Layout user={user} navData={navData}>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          Films
        </span>
      </h1>
        <Films films={data}/>
        <div className="space-x-2 space-y-2">
        <button
          className={`md:p-2 rounded py-2 text-black text-white p-2 ${
            pageIndex === 1 ? 'bg-gray-300' : 'bg-blue-400'
          }`}
          disabled={pageIndex === 1}
          onClick={() => setPageIndex(pageIndex - 1)}
        >
          {' '}
          Previous
        </button>
        <button
          className={`md:p-2 rounded py-2 text-black text-white p-2 ${
            pageIndex === (data && data.meta.pagination.pageCount)
              ? 'bg-gray-300'
              : 'bg-blue-400'
          }`}
          disabled={pageIndex === (data && data.meta.pagination.pageCount)}
          onClick={() => setPageIndex(pageIndex + 1)}
        >
          Next
        </button>
        <span>{`${pageIndex} of ${
          data && data.meta.pagination.pageCount
        }`}</span>
      </div>
    </Layout>
  )
}

export default FilmsPageLists;

export async function getStaticProps() {
    const filmsResponse = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?pagination[page]=1&pagination[pageSize]=5`
    );
    const navDataResponse = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/navbar?populate=*`
    );
    return {
      props: {
        films: filmsResponse,
        navData:navDataResponse
      },
    };
  }