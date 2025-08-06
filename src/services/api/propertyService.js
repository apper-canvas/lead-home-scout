// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from database schema
const TABLE_NAME = 'property_c';

export const propertyService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "squareFeet_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "yearBuilt_c" } },
          { field: { Name: "listingDate_c" } },
          { field: { Name: "coordinates_c" } }
        ],
        orderBy: [
          {
            fieldName: "listingDate_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data to match UI expectations
      const transformedData = response.data.map(property => ({
        Id: property.Id,
        title: property.title_c,
        price: property.price_c,
        type: property.type_c,
        bedrooms: property.bedrooms_c,
        bathrooms: property.bathrooms_c,
        squareFeet: property.squareFeet_c,
        address: JSON.parse(property.address_c || '{}'),
        images: property.images_c ? property.images_c.split('\n') : [],
        description: property.description_c,
        features: property.features_c ? property.features_c.split(',') : [],
        yearBuilt: property.yearBuilt_c,
        listingDate: property.listingDate_c,
        coordinates: JSON.parse(property.coordinates_c || '{}')
      }));
      
      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getById(Id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "squareFeet_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "yearBuilt_c" } },
          { field: { Name: "listingDate_c" } },
          { field: { Name: "coordinates_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, Id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error(`Property with Id ${Id} not found`);
      }
      
      // Transform data to match UI expectations
      const property = response.data;
      return {
        Id: property.Id,
        title: property.title_c,
        price: property.price_c,
        type: property.type_c,
        bedrooms: property.bedrooms_c,
        bathrooms: property.bathrooms_c,
        squareFeet: property.squareFeet_c,
        address: JSON.parse(property.address_c || '{}'),
        images: property.images_c ? property.images_c.split('\n') : [],
        description: property.description_c,
        features: property.features_c ? property.features_c.split(',') : [],
        yearBuilt: property.yearBuilt_c,
        listingDate: property.listingDate_c,
        coordinates: JSON.parse(property.coordinates_c || '{}')
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(propertyData) {
    try {
      const apperClient = getApperClient();
      
      // Transform data to database field names (only Updateable fields)
      const transformedData = {
        title_c: propertyData.title,
        price_c: propertyData.price,
        type_c: propertyData.type,
        bedrooms_c: propertyData.bedrooms,
        bathrooms_c: propertyData.bathrooms,
        squareFeet_c: propertyData.squareFeet,
        address_c: JSON.stringify(propertyData.address),
        images_c: Array.isArray(propertyData.images) ? propertyData.images.join('\n') : propertyData.images,
        description_c: propertyData.description,
        features_c: Array.isArray(propertyData.features) ? propertyData.features.join(',') : propertyData.features,
        yearBuilt_c: propertyData.yearBuilt,
        listingDate_c: propertyData.listingDate || new Date().toISOString(),
        coordinates_c: JSON.stringify(propertyData.coordinates)
      };
      
      const params = {
        records: [transformedData]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
          throw new Error(failedRecords[0].message || 'Failed to create property');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(Id, propertyData) {
    try {
      const apperClient = getApperClient();
      
      // Transform data to database field names (only Updateable fields)
      const transformedData = {
        Id: Id,
        title_c: propertyData.title,
        price_c: propertyData.price,
        type_c: propertyData.type,
        bedrooms_c: propertyData.bedrooms,
        bathrooms_c: propertyData.bathrooms,
        squareFeet_c: propertyData.squareFeet,
        address_c: JSON.stringify(propertyData.address),
        images_c: Array.isArray(propertyData.images) ? propertyData.images.join('\n') : propertyData.images,
        description_c: propertyData.description,
        features_c: Array.isArray(propertyData.features) ? propertyData.features.join(',') : propertyData.features,
        yearBuilt_c: propertyData.yearBuilt,
        listingDate_c: propertyData.listingDate,
        coordinates_c: JSON.stringify(propertyData.coordinates)
      };
      
      const params = {
        records: [transformedData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
          throw new Error(failedRecords[0].message || 'Failed to update property');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(Id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [Id]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error(failedRecords[0].message || 'Failed to delete property');
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};