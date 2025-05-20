
import { AuthProvider } from '@/contexts/AuthContext';
import { RoomsProvider } from '@/contexts/RoomsContext';
import { LocationProvider } from '@/contexts/LocationContext';
import Layout from '@/components/Layout';
import SchoolMap from '@/components/SchoolMap';

const Index = () => {
  return (
    <AuthProvider>
      <RoomsProvider>
        <LocationProvider>
          <Layout>
            <SchoolMap />
          </Layout>
        </LocationProvider>
      </RoomsProvider>
    </AuthProvider>
  );
};

export default Index;
