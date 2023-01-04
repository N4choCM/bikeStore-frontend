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

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log("Products Response: ", data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log("ERROR: ", error);
      }
    );
  }

  processProductResponse(resp: any) {
    const productName: String[] = [];
    const productQuantity: number[] = [];

    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.productsList;

      listCProduct.forEach((element: ProductElement) => {
        productName.push(element.name);
        productQuantity.push(element.quantity);
      });

      //nuestro gráfico de doughnut de productos
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
