import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PropertyList from "../../components/properties/PropertyList";
import PropertyDetail from "../../components/properties/PropertyDetail";
import { getAllGeneralProperties } from '../../services/properties';
import { fetchAndFilterUsersByAccountType } from "../../services/user";
import Loading from "../../components/elements/Loading";

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalProperty, setGeneralProperty] = useState([]);
  const [tenants, setTenants] = useState([]);


useEffect(() => {
    setLoading(true);
    async function fetchData() {
        const tenantData = await fetchAndFilterUsersByAccountType();
        const general = await getAllGeneralProperties();
        // const allTenantDefault = await getAllTenantDefault();
        setTenants(tenantData);
        setGeneralProperty(general);
        // setAllDefault(allTenantDefault);
        setLoading(false);
    }

    fetchData();
}, []);

// if loading return skeleton
if (loading) {
  return (
    <Loading/>
  );
}

  return (
    <div>
      <PageMeta
        title="Property Management | Property Management Platform"
        description="View and manage properties in the property management system"
      />
      <PageBreadcrumb pageTitle={selectedProperty ? "Property Details" : "Property Management"} />
      <div>
        {selectedProperty ? (
          <PropertyDetail 
            property={selectedProperty} 
            tenants={tenants}
            onBack={() => setSelectedProperty(null)} 
          />
        ) : (
          <PropertyList 
            properties={generalProperty} 
            onPropertyClick={setSelectedProperty} 
          />
        )}
      </div>
    </div>
  );
}