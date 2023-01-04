import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CategoryService } from "src/app/modules/shared/services/category.service";

@Component({
  selector: "app-new-category",
  templateUrl: "./new-category.component.html",
  styleUrls: ["./new-category.component.css"],
})
export class NewCategoryComponent implements OnInit {
  public categoryForm: FormGroup;
  formStatus: string = "";
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.formStatus = "Add";

    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    });

    if (data != null) {
      this.updateForm(data);
      this.formStatus = "Update";
    }
  }

  ngOnInit(): void {}

  /**
   * Procedure that establishes the logic implemented when clicking the "Save" button
   * from this Dialog view. In particular, it saves or updates a Category depending on
   * whether the Category data is null (in this case the method "saveCategory" from
   * CategoryService is called) or not (in this case the method "updateCategory" from
   * CategoryService is called).
   * @see CategoryService
   */
  onSave() {
    let data = {
      name: this.categoryForm.get("name")?.value,
      description: this.categoryForm.get("description")?.value,
    };

    if (this.data != null) {
      this.categoryService.updateCategory(data, this.data.id).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      this.categoryService.saveCategory(data).subscribe(
        (data: any) => {
          console.log(data);
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  /**
   * Procedure that establishes the logic implemented when clicking the "Cancel" button
   * from this Dialog view.
   */
  onCancel() {
    this.dialogRef.close(3);
  }

  /**
   * Method called from this constructor to update the data of the form of this dialog.
   * @param data The data of this form.
   */
  updateForm(data: any) {
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
    });
  }
}
