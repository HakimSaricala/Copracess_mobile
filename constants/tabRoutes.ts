/* eslint-disable prettier/prettier */

import { icons } from '~/constants';

interface Route {
  name: string;
  icon: any;
  label: string;
  visible: boolean;
  href: any | null;
}

const Routes = (isOilmill: boolean, isCopraOwner: boolean): Route[] => [
  {
    name: 'oilhome',
    icon: icons.window,
    label: 'Home',
    visible: true,
    href: isOilmill ? '/oilhome' : null,
  },
  {
    name: 'buyerhome',
    icon: icons.window,
    label: 'Home',
    visible: true,
    href: isCopraOwner ? '/buyerhome' : null,
  },
  {
    name: 'transaction',
    icon: icons.records,
    label: 'Transaction',
    visible: true,
    href: '/transaction',
  },
  {
    name: 'booking',
    icon: icons.booking,
    label: 'Booking',
    visible: isCopraOwner,
    href: isCopraOwner ? '/booking' : null,
  },
  {
    name: 'map',
    icon: icons.millmap,
    label: 'Map',
    visible: isCopraOwner,
    href: isCopraOwner ? '/map' : null,
  },
  {
    name: 'price',
    icon: icons.price,
    label: 'Price',
    visible: isOilmill,
    href: isOilmill ? '/price' : null,
  },
  {
    name: 'queue',
    icon: icons.queue,
    label: 'Queue',
    visible: isOilmill,
    href: isOilmill ? '/queue' : null,
  },
  {
    name: 'settings',
    icon: icons.profile,
    label: 'Settings',
    visible: true, // Added missing visible property
    href: null,
  },
];

export default Routes;
