import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const base_url = environment.base_url;

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  /**
   * REST Request for getting all the Categories.
   * @returns All the categories.
   */
  getCategories() {
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }

  /**
   * REST Request for saving a Category.
   * @param body The data of the Category to be saved.
   * @returns The saved Category.
   */
  saveCategory(body: any) {
    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, body);
  }

  /**
   * REST Request for updating a Category.
   * @param body The data of the Category to be updated.
   * @param id The ID of the Category to be updated.
   * @returns The updated Category.
   */
  updateCategory(body: any, id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * REST Request for deleting a Category.
   * @param id The ID of the Category to be deleted.
   * @returns The deleted Category.
   */
  deleteCategory(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * REST Request for getting a Category by its ID.
   * @param id The ID of the Category to be found.
   * @returns The found Category.
   */
  getCategoryById(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * REST Request to export an EXCEL file with all the Category registries.
   * @returns A download with the EXCEL file.
   */
  exportCategories() {
    const endpoint = `${base_url}/categories/export/excel`;
    return this.http.get(endpoint, {
      responseType: "blob",
    });
  }
}
