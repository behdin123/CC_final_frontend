import api from '../../../api/catalogApi.js'; // Importér den relevante API-fil. Ændre denne sti, hvis den er forkert.
// import { catalogs } from './catalogGetCrud.js'; // Hvis du har en ref til alle kataloger.

const removeCatalog = async (id) => {
  try {
    await api.removeCatalog(id);
    // Opdater den lokale tilstand, hvis du har en ref til kataloger
    // catalogs.value = catalogs.value.filter(catalog => catalog._id !== id);
  } catch (error) {
    console.error('Error removing catalog:', error);
  }
};

export {
  removeCatalog
};
