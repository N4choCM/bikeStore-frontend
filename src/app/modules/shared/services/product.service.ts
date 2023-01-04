import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const base_url = environment.base_url;

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  /**
   * REST Request for getting all the Products.
   * @returns All the products.
   */
  getProducts() {
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  /**
   * REST Request for saving a Product.
   * @param body The data of the Product to be saved.
   * @returns The saved Product.
   */
  saveProduct(body: any) {
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

  /**
   * REST Request for updating a Product.
   * @param body The data of the Product to be updated.
   * @param id The ID of the Product to be updated.
   * @returns The updated Product.
   */
  updateProduct(body: any, id: any) {
    const endpoint = `${base_url}/products/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * REST Request for deleting a Product.
   * @param id The ID of the Product to be deleted.
   * @returns The deleted Product.
   */
  deleteProduct(id: any) {
    const endpoint = `${base_url}/products/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * REST Request for getting a Products by its name.
   * @param name The name of the Product to be found.
   * @returns The found Product.
   */
  getProductByName(name: any) {
    const endpoint = `${base_url}/products/filter/${name}`;
    return this.http.get(endpoint);
  }

  /**
   * REST Request to export an EXCEL file with all the Product registries.
   * @returns A download with the EXCEL file.
   */
  exportProduct() {
    const endpoint = `${base_url}/products/export/excel`;
    return this.http.get(endpoint, {
      responseType: "blob",
    });
  }
}
