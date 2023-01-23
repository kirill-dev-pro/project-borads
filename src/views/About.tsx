import Header from '../components/Header'
import { Component } from 'solid-js'

const About: Component = () => {
  return (
    <>
      <Header title='About' />
      <main>
        <div class='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
          <div class='px-4 py-6 sm:px-0'>
            <div class='mx-auto mt-10 max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
              <div class='sm:text-center lg:text-left'>
                <h2 class='text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl'>
                  This demo is using
                  <br class='xl:hidden' />{' '}
                  <a
                    target='_blank'
                    class='text-indigo-600 underline hover:text-indigo-500'
                    href='https://tailwindcss.com'
                    rel='noreferrer'
                  >
                    Tailwind CSS
                  </a>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default About
