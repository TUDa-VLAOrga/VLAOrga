import {type AppointmentCategory, SseMessageType} from "@/lib/databaseTypes";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_APPOINTMENT_CATEGORIES} from "@/lib/api.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {fetchBackend} from "@/lib/utils.ts";

function handleCategoryCreated(event: MessageEvent, currentValue: AppointmentCategory[]) {
  const newCategory = JSON.parse(event.data) as AppointmentCategory;
  return [...currentValue, newCategory];
}

function handleCategoryDeleted(event: MessageEvent, currentValue: AppointmentCategory[]) {
  const deletedNote = JSON.parse(event.data) as AppointmentCategory;
  return currentValue.filter((cat) => cat.id !== deletedNote.id);
}

function handleCategoryUpdated(event: MessageEvent, currentValue: AppointmentCategory[]) {
  const updatedCategory = JSON.parse(event.data) as AppointmentCategory;
  return currentValue.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat));
}

/**
 * useCategories stores and manages the list of event categories (kinds).
 * It prevents duplicates to keep the select options clean.
 */
export function useCategories() {
  const sseHandlers = new Map<
    SseMessageType,
    (event: MessageEvent, currentValue: AppointmentCategory[]) => AppointmentCategory[]
  >();
  sseHandlers.set(SseMessageType.APPOINTMENTCATEGORYCREATED, handleCategoryCreated);
  sseHandlers.set(SseMessageType.APPOINTMENTCATEGORYDELETED, handleCategoryDeleted);
  sseHandlers.set(SseMessageType.APPOINTMENTCATEGORYUPDATED, handleCategoryUpdated);
  const [categories, _setCategories] = useSseConnectionWithInitialFetch<AppointmentCategory[]>(
    [],
    API_URL_APPOINTMENT_CATEGORIES,
    sseHandlers
  );

  /**
   * Adds a category if it doesn't exist yet.
   */
  async function handleAddCategory(category: AppointmentCategory) {
    return fetchBackend(API_URL_APPOINTMENT_CATEGORIES, "POST", category)
      .then((newCat) => newCat as AppointmentCategory)
      .catch((error) => {
        Logger.error("Error during category creation: " + error);
        return;
      });
  }

  return {
    categories,
    handleAddCategory,
  };
}
