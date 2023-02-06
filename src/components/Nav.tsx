import { useAuth } from '../lib/firebase/auth/useAuth'
import { Component, createSignal, For, Show } from 'solid-js'
import { A } from '@solidjs/router'

const Nav: Component = () => {
  const [showProfileMenu, setShowProfileMenu] = createSignal(false)
  const [showMenu, setShowMenu] = createSignal(false)
  const { user, logout } = useAuth()

  const links = [
    { text: 'Home', to: '/' },
    // { text: 'About', to: '/about' },
  ]
  const activeClass = 'text-white bg-gray-900'
  const inactiveClass = 'text-gray-300 hover:text-white hover:bg-gray-700'

  return (
    <nav class='bg-gray-800'>
      <div class='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div class='flex h-16 items-center justify-between'>
          <div class='flex items-center'>
            <div class='shrink-0'>
              <img
                class='h-8 w-8'
                src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
                alt='Workflow logo'
              />
            </div>
            <div class='hidden md:block'>
              <div class='ml-10 flex items-baseline space-x-4'>
                <For each={links}>
                  {(link, index) => (
                    <A
                      href={link.to}
                      end
                      activeClass={activeClass}
                      inactiveClass={inactiveClass}
                      class={`rounded-md px-3 py-2 text-sm font-medium 
                      ${index() > 0 && 'ml-4'}`}
                    >
                      {link.text}
                    </A>
                  )}
                </For>
              </div>
            </div>
          </div>
          <div class='hidden md:block'>
            <Show
              when={user()}
              fallback={
                <div
                  class='shadow-xs rounded-md bg-white py-1'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu'
                >
                  <a
                    href='/'
                    class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                  >
                    Sign in
                  </a>
                </div>
              }
            >
              <div class='ml-4 flex items-center md:ml-6'>
                <button class='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                  <span class='sr-only'>View notifications</span>
                  <svg
                    class='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                    />
                  </svg>
                </button>

                {/* Profile dropdown */}
                <div class='relative ml-3'>
                  <button
                    class='flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    id='user-menu'
                    aria-label='User menu'
                    aria-haspopup='true'
                    onClick={() => setShowProfileMenu(prev => !prev)}
                  >
                    <span class='sr-only'>Open user menu</span>
                    <img
                      class='h-8 w-8 rounded-full'
                      src={
                        user().photoURL ||
                        'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                      }
                      alt=''
                    />
                  </button>
                  {/*  
                Profile dropdown panel, show/hide based on dropdown state.
                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              */}
                  {showProfileMenu() && (
                    <div class='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div
                        class='shadow-xs rounded-md bg-white py-1'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='user-menu'
                      >
                        {/* <a
                          href='#'
                          class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          role='menuitem'
                        >
                          Your Profile
                        </a>
                        <a
                          href='#'
                          class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          role='menuitem'
                        >
                          Settings
                        </a> */}
                        <a
                          href='/'
                          onClick={logout}
                          class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          role='menuitem'
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Show>
          </div>
          <div class='-mr-2 flex md:hidden'>
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMenu(prev => !prev)}
              class='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none'
            >
              {/* Menu open: "hidden", Menu closed: "block" */}
              <svg class='block h-6 w-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
              {/* Menu open: "block", Menu closed: "hidden" */}
              <svg class='hidden h-6 w-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu open: "block", Menu closed: "hidden" */}
      <div class={`md:hidden ${showMenu() ? 'block' : 'hidden'}`}>
        <div class='px-2 pt-2 pb-3 sm:px-3'>
          <For each={links}>
            {(link, index) => (
              <A
                href={link.to}
                end
                activeClass={activeClass}
                inactiveClass={inactiveClass}
                class={`block rounded-md px-3 py-2 text-sm font-medium ${index() > 0 && 'mt-1'}`}
              >
                {link.text}
              </A>
            )}
          </For>
        </div>
        <Show
          when={user()}
          fallback={
            <div class='border-t border-gray-700 pt-4 pb-3'>
              <div class='mt-3 space-y-1 px-2'>
                <a
                  href='/'
                  class='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                >
                  Login
                </a>
              </div>
            </div>
          }
        >
          <div class='border-t border-gray-700 pt-4 pb-3'>
            <div class='flex items-center px-5'>
              <div class='shrink-0'>
                <img
                  class='h-10 w-10 rounded-full'
                  src={
                    user().photoURL ||
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                  }
                  alt=''
                />
              </div>
              <div class='ml-3'>
                <div class='text-base font-medium leading-none text-white'>
                  {user().displayName}
                </div>
                <div class='text-sm font-medium leading-none text-gray-400'>{user().email}</div>
              </div>
            </div>
            <div class='mt-3 space-y-1 px-2'>
              {/* <a
                href='#'
                class='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
              >
                Your Profile
              </a>
              <a
                href='#'
                class='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
              >
                Settings
              </a> */}
              <a
                href='/'
                onClick={logout}
                class='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
              >
                Sign out
              </a>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}

export default Nav
