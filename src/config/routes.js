import TemplateSelection from '@/components/pages/TemplateSelection';
import DetailsForm from '@/components/pages/DetailsForm';
import Download from '@/components/pages/Download';

export const routes = {
  templates: {
    id: 'templates',
    label: 'Select Template',
    path: '/',
    icon: 'Layout',
    component: TemplateSelection,
    step: 1
  },
  details: {
    id: 'details',
    label: 'Fill Details',
    path: '/details',
    icon: 'User',
    component: DetailsForm,
    step: 2
  },
  download: {
    id: 'download',
    label: 'Download',
    path: '/download',
    icon: 'Download',
    component: Download,
    step: 3
  }
};

export const routeArray = Object.values(routes);
export default routes;