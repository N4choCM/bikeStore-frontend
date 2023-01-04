import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { ProductElement } from "src/app/modules/product/product/product.component";
import { ProductService } from "src/app/modules/shared/services/product.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  chartdoughnut: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Procedure that gets all the Products from the DB.
   */
  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log("products response: ", data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log("ERROR: ", error);
      }
    );
  }

  /**
   * Method that collects a Products List with names and quantity from the Java backend
   * and uses this data to build a doughnut chart.
   * @param resp An instance of the ProductResponse.java from the Backend.
   */
  processProductResponse(resp: any) {
    const productName: String[] = [];
    const productQuantity: number[] = [];

    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.productsList;

      listCProduct.forEach((element: ProductElement) => {
        productName.push(element.name);
        productQuantity.push(element.quantity);
      });

      this.chartdoughnut = new Chart("canvas-doughnut", {
        type: "doughnut",
        data: {
          labels: productName,
          datasets: [{ label: "Products", data: productQuantity }],
        },
      });
    }
  }
}
