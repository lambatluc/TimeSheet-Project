import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import pageImgEror from '@/assets/image/404-error.png';
import { ButtonName, TEXT_404_PAGE } from '@/constants';
const Page404 = (): JSX.Element => {
  return (
    <div className="flex items-center max-h-screen flex-col justify-center lg:flex-row py-28 md:px-24 md:py-20 lg:py-32">
      <div className="w-full lg:w-7/12">
        <img src={pageImgEror} alt="pageError" className='w-9/12'/>
      </div>
      <div className="w-full lg:w-5/12 transition-transform duration-300 transform hover:scale-105">
        <h1 className='py-4 text-3xl lg:text-4xl font-extrabold dark:text-gray-50 text-gray-800'>{TEXT_404_PAGE.PAGE_TITLE}</h1>
        <p className='py-2 text-base dark:text-gray-50 text-gray-800'>{TEXT_404_PAGE.PAGE_DESCRIPTION_1}</p>
        <p className='py-2 text-base dark:text-gray-50 text-gray-800'>{TEXT_404_PAGE.PAGE_DESCRIPTION_2}</p>
        <div className='flex justify-center items-center space-x-10'>
          <Link to='/projects'>
            <Button className="w-full my-4 border rounded-md px-1 sm:px-16 py-5 text-white focus:outline-none">{ButtonName.backHomeButton}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page404;
