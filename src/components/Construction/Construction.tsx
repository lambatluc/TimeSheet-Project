import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import pageImg from '@/assets/image/pageundo.png';
import { ButtonName, TEXT_NOTFOUND_PAGE } from '@/constants';
const Construction = (): JSX.Element => {
  return (
    <div className='h-screen dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-900 bg-gradient-to-r from-gray-100 to-gray-400'>
      <div className="w-9/12 m-auto py-12 min-h-[80vh] flex items-center justify-center">
        <div className='overflow-hidden sm:rounded-lg pb-8 shadow-2xl dark:bg-gradient-to-r dark:from-primary-100 dark:to-primary-200 bg-gradient-to-r from-primary-50 to-primary-200'>
          <div className="border-t border-gray-200 text-center pt-8">
            <img src={pageImg} alt="pageImg" className='w-1/3 h-1/3 m-auto'/>
            <h1 className="text-6xl text-gray-600 font-medium py-8">{TEXT_NOTFOUND_PAGE.PAGE_TITLE}</h1>
            <p className="text-2xl pb-8 px-12 text-gray-500 font-medium">{TEXT_NOTFOUND_PAGE.PAGE_DESCRIPTION}</p>
            <Link to='/'>
              <Button className="bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-200 hover:to-primary-500 text-white font-semibold px-6 py-3 rounded-md mr-6">
                {ButtonName.homeButton}
              </Button>
            </Link>
            <Link to='https://ncc.asia/#contact'>
              <button className="bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-600 hover:to-primary-600 text-white font-semibold px-6 py-3 rounded-md">
                {ButtonName.contactButton}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Construction;
