import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    // Fetch categories from the server/database and set them in the state
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/categories'); // Replace with the actual API endpoint to fetch categories
      const fetchedCategories = response.data;
      setCategories(fetchedCategories);
    } catch (error) {
      console.error(error);
      // Handle the error gracefully
    }
  };

  const fetchSubCategories = async (categoryId, rowIndex) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/categories/${categoryId}/subcategories`); // Replace with the actual API endpoint to fetch subcategories
      const fetchedSubCategories = response.data;
      const updatedGridData = [...gridData];
      updatedGridData[rowIndex].categoryId = categoryId;
      updatedGridData[rowIndex].subCategoryId = null;
      updatedGridData[rowIndex].disabled = false;
      setGridData(updatedGridData);
      setSubCategories(fetchedSubCategories);
    } catch (error) {
      console.error(error);
      // Handle the error gracefully
    }
  };

  const handleAddRow = () => {
    const newRow = {
      categoryId: null,
      subCategoryId: null,
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      disabled: false,
    };
    setGridData([...gridData, newRow]);
  };

  const handleDeleteRows = () => {
    const updatedGridData = gridData.filter(
      (_, index) => !selectedRows.includes(index)
    );
    setGridData(updatedGridData);
    setSelectedRows([]);
  };

  const handleEditRow = (rowIndex) => {
    const updatedGridData = [...gridData];
    updatedGridData[rowIndex].disabled = false;
    setGridData(updatedGridData);
  };

  const handleInputChange = (event, rowIndex, columnName) => {
    const updatedGridData = [...gridData];
    updatedGridData[rowIndex][columnName] = event.target.value;
    setGridData(updatedGridData);
  };

  const calculateRowTotal = (row) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const total = daysOfWeek.reduce((acc, day) => acc + parseInt(row[day] || 0), 0);
    return total;
  };

  const handleSaveRow = async (rowIndex) => {
    const row = gridData[rowIndex];
    const updatedGridData = [...gridData];
    updatedGridData[rowIndex].disabled = true;
    setGridData(updatedGridData);

    try {
      // Send the row data to the backend API endpoint
      const response = await axios.post('/api/grid-data', row);
      console.log(response.data); // Log the response from the backend

      // Update the gridData state or perform any other necessary actions
    } catch (error) {
      console.error(error);
      // Handle the error gracefully
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedRows([...selectedRows, index]);
                    } else {
                      setSelectedRows(
                        selectedRows.filter((rowIndex) => rowIndex !== index)
                      );
                    }
                  }}
                />
              </td>
              <td>
                <select
                  value={row.categoryId || ''}
                  onChange={(event) =>
                    fetchSubCategories(parseInt(event.target.value), index)
                  }
                  disabled={row.disabled}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={row.subCategoryId || ''}
                  onChange={(event) => {
                    const subCategoryId = parseInt(event.target.value);
                    const updatedGridData = [...gridData];
                    updatedGridData[index].subCategoryId = subCategoryId;
                    // Additional logic to update other fields based on the subcategory selection
                    setGridData(updatedGridData);
                  }}
                  disabled={row.disabled}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="sunday"
                  value={row.sunday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'sunday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="monday"
                  value={row.monday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'monday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="tuesday"
                  value={row.tuesday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'tuesday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="wednesday"
                  value={row.wednesday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'wednesday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="thursday"
                  value={row.thursday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'thursday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="friday"
                  value={row.friday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'friday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="saturday"
                  value={row.saturday}
                  onChange={(event) =>
                    handleInputChange(event, index, 'saturday')
                  }
                  disabled={row.disabled}
                />
              </td>
              <td>{calculateRowTotal(row)}</td>
              <td>
                {row.disabled ? (
                  <button onClick={() => handleEditRow(index)}>Edit</button>
                ) : (
                  <button onClick={() => handleSaveRow(index)}>Save</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleDeleteRows}>Delete Rows</button>
      </div>
    </div>
  );
};

export default App;
