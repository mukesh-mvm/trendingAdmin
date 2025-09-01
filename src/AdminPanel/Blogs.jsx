import React, { useState, useEffect, useRef } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Upload,
    Switch,
    DatePicker,
    InputNumber,
    Space,
    Popconfirm,
    List
} from "antd";

import {
    BellOutlined,
    TranslationOutlined,
    TruckOutlined,
    CloseCircleOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { UploadOutlined } from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import JoditEditor from "jodit-react";
import { Content } from "antd/es/layout/layout";
const { Option } = Select;

const { TextArea } = Input;
const Blogs = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompBlog, setEditingCompBlog] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const [subcategories, setSubCategoris] = useState([])
    const [company, setCompany] = useState([])
    const [image1, setImage] = useState();
    const [photo, setPhoto] = useState("");
    const [cross, setCross] = useState(true);
    const [record1, setRecord] = useState();
    const [imageTrue, setImageTrue] = useState(false);
    const [tag, setTag] = useState([])
    const [user, setUser] = useState([])
    const editor = useRef(null);
    const [editorContent, setEditorContent] = useState("");
    const auth1 = JSON.parse(localStorage.getItem('auth'));

    const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const [search, setSearch] = useState("")
    const [seachloading, setSearchLoading] = useState(false);
      const [images, setImages] = useState([]);



    const handleCategoryChange = (value) => {
        setSelectedCategory(value); // save selected category ID to variable
        console.log("Selected Category ID:", value);
    };


    const handleCategoryChange1 = (value) => {
        setSelectedSubCategory(value); // save selected category ID to variable
        console.log("Selected Category ID:", value);
    };





    const handleRowClick = (record) => {
        console.log("Clicked row data:", record);
        setRecord(record);
        setImage(record?.image)
        setCross(true);
         setImages(record?.images)

        // Access the clicked row's data here
        // You can now use 'record' to get the details of the clicked row
    };

    const handleCross = () => {
        setCross(false);
    };

    // console.log(auth?.user._id);

    useEffect(() => {

        fetchData1()
        fetchData3()
        fetchData4()


    }, []);


    useEffect(() => {
        fetchData();
    }, [seachloading])


    useEffect(() => {
        fetchData2()
    }, [selectedCategory])







    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/catagory/get-categories");
            // console.log("----data-----", res.data);
            setCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };



    const fetchData2 = async () => {
        try {
            const res = await axios.get(`${baseurl}/api/subcatagory/getSubCategoryByCatId/${selectedCategory}`);
            // console.log("----data-----", res.data);
            setSubCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };





    const fetchData3 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/tag/getAllTag");
            console.log("----data tag-----", res.data);
            setTag(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };




    const fetchData4 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/auth/getAllUsers");
            // console.log("----data user-----", res.data);
            setUser(res.data.users);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };





    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/blog/getAllBlog");

            // console.log("----data-----", res.data);

            const data1 = res?.data;
            // setData(res.data);


            if (seachloading) {
                const filtered = data1.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
                setData(filtered);
            } else {
                setData(data1);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    const handleSeach = () => {
        setSearchLoading(true)

    }

    const ClearSeach = () => {
        setSearchLoading(false)
        setSearch("")

    }

    // console.log("---loading---",seachloading)

    const handleChange = (value) => {
        setSearch(value)

        // console.log("----seach----",value)
    }


    const handleAdd = () => {
        setEditingCompBlog(null);
        form.resetFields();
        setIsModalOpen(true);
        setImages([])
    };

    const handleEdit = (record) => {
        setImageTrue(true);
        setEditingCompBlog(record);
        console.log(record);
        setSelectedCategory(record.category._id)
        setEditorContent(record.content)
         setImages(record?.images)


         const formattedAds = (record?.Ads || []).map(ad => ({
    text1: ad?.text1 || [],
    text2: ad?.text2 || '',
    link1: ad?.link1 || ''
  }));

        form.setFieldsValue({
            title: record?.title,
            mtitle: record?.mtitle,
            
            mdesc: record?.mdesc,
            category: record?.category._id,
            tag: record?.tag?._id,
            faqs: record?.faqs || [],
            alt: record?.alt,
            source: record?.source,
            conclusion: record?.conclusion,
            slug: record?.slug,
            subtitle: record?.subtitle,
            Ads: formattedAds,
            linkArray: record?.linkArray || [] // ✅ add this
            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/blog/toggled/${record?._id}`
            );
            console.log(response);

            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`${baseurl}/api/blog/deleteBlog/${record}`)
            if (response) {
                message.success("Status updated succesfully");
                fetchData();


                if (response) {
                    const postData = {
                        blogsToDelete: [record]
                    }

                    const response1 = await axios.patch(
                        `${baseurl}/api/auth/deleteSpecificuserBLog/${auth1?.user?._id}`,
                        postData
                    );

                    // console.log(response1.data)
                }


            }
        } catch (error) {
            console.log(error)
        }
    }



    // const uploadImage = async (file) => {
    //     console.log(file);
    //     const formData = new FormData();
    //     formData.append("image", file.file);
    //     // console.log(file.file.name);

    //     try {
    //         const response = await axios.post(
    //             `${baseurl}/upload`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );

    //         if (response) {
    //             message.success("Image uploaded successfully!");
    //             setImage(response.data.imageUrl);
    //         }

    //         return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
    //     } catch (error) {
    //         message.error("Error uploading image. Please try again later.");
    //         console.error("Image upload error:", error);
    //         return null;
    //     }
    // };



    const uploadImage = async (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append("image", file.file);
        // console.log(file.file.name);

        try {
            const response = await axios.post(
                `${baseurl}/api/catagory/uploadImage`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response) {
                message.success("Image uploaded successfully!");
                setImage(response.data.imageUrl);
            }

            return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
            message.error("Error uploading image. Please try again later.");
            console.error("Image upload error:", error);
            return null;
        }
    };



    const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file.file);
    console.log("image", file.file);
    try {
      const response = await axios.post(
`${baseurl}/api/catagory/uploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.imageUrl) {
        // Store the image URL in the state array
        setImages((prevImages) => [...prevImages, response.data.imageUrl]);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Image upload failed!");
      }
    } catch (error) {
      message.error("Error uploading image!");
    }

    return false; // Prevent default upload behavior
  };

    const handlePost = async (values) => {

        const postData = {
            title: values?.title,
            mtitle: values?.mtitle,
            mdesc: values?.mdesc,
            category: values?.category,
            tag: values?.tag,
            conclusion: values?.conclusion,
            author: auth1?.user?._id,
            image: image1,
            content: editorContent,
            faqs: values?.faqs,
            alt: values?.alt,
            source: values?.source,
            slug: values?.slug,
            subtitle: values?.subtitle,
            Ads: values?.Ads,
            linkArray: values?.linkArray,
             images: images


        };


        try {
            const response = await axios.post(
                baseurl + "/api/blog/createBlog",
                postData
            );
            console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                message.success("User created successfully!");
                setPhoto("");
                fetchData();
                setEditorContent("")
                 setImages([]);


                if (response?.data?._id) {
                    const postData = {
                        blog: [response?.data?._id]
                    }

                    const response1 = await axios.patch(
                        `${baseurl}/api/auth/updateUser/${auth1?.user?._id}`,
                        postData
                    );

                    // console.log(response1.data)
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    const removeImage = (url) => {
    setImages((prevImages) => prevImages.filter((image) => image !== url));
  };
    const handlePut = async (values) => {

        const postData = {
            title: values?.title,
            mtitle: values?.mtitle,
            mdesc: values?.mdesc,
            category: values?.category,
            tag: values?.tag,
            author: auth1?.user?._id,
            content: editorContent,
            faqs: values?.faqs,
            alt: values?.alt,
            Ads: values?.Ads,
            linkArray: values?.linkArray,
            conclusion: values?.conclusion,
            slug: values?.slug,
            source: values?.source,
            subtitle: values?.subtitle,
            image: imageTrue ? image1 : values.logo,
             images: images


        };


        console.log("----post data----", postData)

        try {
            const response = await axios.put(
                `${baseurl}/api/blog/updateBlog/${editingCompBlog?._id}`,
                postData
            );
            console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                fetchData();
                message.success("User update successfully!");
                form.resetFields();
                setPhoto("");
                setEditorContent("")
                 setImages([]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (values) => {
        if (editingCompBlog) {
            await handlePut(values);
        } else {
            await handlePost(values);
        }
    };

    const columns = [
        {
            title: "Blog Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Categories",
            dataIndex: ['category', 'name'],
            key: "name",
        },




        {
            title: "Author",
            dataIndex: ['author', 'name'],
            key: "subcategories",
        },





        // specialization

        {
            title: "Status",
            key: "Status",
            render: (_, record) => (
                <Switch
                    checked={record.status === "Active"}
                    onChange={() => handleStatusToggle(record)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
            ),
        },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },

        {
            title: "Delete",
            render: (_, record) => (
                <>
                    {auth1?.user?.role === 'superAdmin' && (
                        <Popconfirm
                            title="Are you sure you want to delete this blog?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </>
            ),
        }
    ];


    const columns1 = [


         {
            title: "Blog Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Categories",
            dataIndex: ['category', 'name'],
            key: "name",
        },




        // specialization

        // {
        //   title: "Status",
        //   key: "Status",
        //   render: (_, record) => (
        //     <Switch
        //       checked={record.Status === "Active"}
        //       onChange={() => handleStatusToggle(record)}
        //       checkedChildren="Active"
        //       unCheckedChildren="Inactive"
        //     />
        //   ),
        // },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },
    ];




    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Blog
            </Button>

            <div className="search">
                <Input type="text" value={search} onChange={(e) => { handleChange(e.target.value) }} placeholder="Enter Keyword of  BLog Title" />
                <Button onClick={handleSeach}> Search</Button>
                <Button onClick={ClearSeach}> Clear Filter</Button>
            </div>



            {
                auth1?.user?.role === 'superAdmin' ? (<><Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
                    onRow={(record) => ({
                        onClick: () => {
                            handleRowClick(record); // Trigger the click handler
                        },
                    })}

                />
                </>) : (<>
                    <Table
                        columns={columns1}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record._id}
                        onRow={(record) => ({
                            onClick: () => {
                                handleRowClick(record); // Trigger the click handler
                            },
                        })}

                    />

                </>)
            }

            <Modal
                title={editingCompBlog ? "Edit CompBlog" : "Add CompBlog"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>


                    <Form.Item
                        name="title"
                        label="Blog Title"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Title" />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[{ required: true, message: "Please input slug!" }]}
                    >
                        <Input placeholder="Enter Blog slug" />
                    </Form.Item>


                    <Form.Item
                        name="mtitle"
                        label="Blog Meta Title"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Meta Title" />
                    </Form.Item>

                    <Form.Item
                        name="subtitle"
                        label="Subtitle"
                        // rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog subtitle" />
                    </Form.Item>
                    <Form.Item
                        name="source"
                        label="Source"
                        // rules={[{ required: true, message: "Please Enter the source!" }]}
                    >
                        <Input placeholder="Enter News source" />
                    </Form.Item>


                    <Form.Item
                        name="mdesc"
                        label="Blog Meta Description"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Meta Description" />
                    </Form.Item>


                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading} onChange={handleCategoryChange}>
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>



                    <Form.Item
                        name="tag"
                        label="Tags"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a Tag" loading={loading} >
                            {tag.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.tagname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="FAQS" >
                        <Form.List name="faqs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <Space
                                            key={key}
                                            style={{ display: "flex", marginBottom: 8 }}
                                            align="start"
                                        >
                                            <Form.Item
                                                {...restField}
                                                label={`Q${index + 1}`}
                                                name={[name, "ques"]}
                                                // rules={[{ required: true, message: "Please enter a question" }]}
                                            >
                                                <Input placeholder="Question" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label={`A${index + 1}`}
                                                name={[name, "ans"]}
                                                // rules={[{ required: true, message: "Please enter an answer" }]}
                                            >
                                                <Input placeholder="Answer" />
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add FAQ
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>





                    <Form.Item label="Content" required>
                        <JoditEditor
                            ref={editor}
                            value={editorContent}
                            onBlur={(newContent) => setEditorContent(newContent)}
                            tabIndex={1}
                            placeholder="Write your content here..."
                            config={{
                                cleanHTML: {
                                    removeEmptyTags: false,
                                    fillEmptyParagraph: false,
                                    removeEmptyBlocks: false,
                                },
                                uploader: {
                                    url: `${baseurl}/api/amenities/uploadImage`, // Your image upload API endpoint
                                    // This function handles the response
                                    format: "json", // Specify the response format
                                    isSuccess: function (resp) {
                                        return !resp.error;
                                    },
                                    getMsg: function (resp) {
                                        return resp.msg.join !== undefined
                                            ? resp.msg.join(" ")
                                            : resp.msg;
                                    },
                                    process: function (resp) {
                                        return {
                                            files: resp.files || [],
                                            path: resp.files.url,
                                            baseurl: resp.files.url,
                                            error: resp.error || "error",
                                            msg: resp.msg || "iuplfn",
                                        };
                                    },
                                    defaultHandlerSuccess: function (data, resp) {
                                        const files = data.files || [];
                                        console.log({ files });
                                        if (files) {
                                            this.selection.insertImage(files.url, null, 250);
                                        }
                                    },
                                },
                                enter: "DIV",
                                defaultMode: "DIV",
                                removeButtons: ["font"],
                            }}
                        />
                    </Form.Item>


                     <Form.Item
                        name="conclusion"
                        label="Conclusion"
                    // rules={[{ required: true, message: "Please input the conclusion!" }]}
                    >
                        <Input.TextArea placeholder="Enter blog conclusion" rows={4} />
                    </Form.Item>



                    {editingCompBlog ? (
                        <>
                            {cross ? (
                                <>
                                    <CloseCircleOutlined
                                        style={{ width: "30px" }}
                                        onClick={handleCross}
                                    />
                                    <img
                                        src={`${baseurl}${record1.image}`}
                                        alt=""
                                        style={{ width: "100px", height: "100px" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Form.Item
                                        label="Photo"
                                        name="photo"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please upload the driver's photo!",
                                            },
                                        ]}
                                    >
                                        <Upload
                                            listType="picture"
                                            beforeUpload={() => false}
                                            onChange={uploadImage}
                                            showUploadList={false}
                                            customRequest={({ file, onSuccess }) => {
                                                setTimeout(() => {
                                                    onSuccess("ok");
                                                }, 0);
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                        </Upload>
                                    </Form.Item>
                                    {photo && (
                                        <div>
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt="Uploaded"
                                                height="100px"
                                                width="100px"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Form.Item
                                label="Photo"
                                name="photo"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload the driver's photo!",
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={uploadImage}
                                    showUploadList={false}
                                    customRequest={({ file, onSuccess }) => {
                                        setTimeout(() => {
                                            onSuccess("ok");
                                        }, 0);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                </Upload>
                            </Form.Item>
                            {photo && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Uploaded"
                                        height="100px"
                                        width="100px"
                                    />
                                </div>
                            )}
                        </>
                    )}

{/*   
   <Form.Item
                        name="alt"
                        label="Alt"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Image alt" />
                    </Form.Item>

*/ }
                   

                    {/* image array */}
          <Form.Item label="Upload Icons">
            <Dragger
              name="file"
              customRequest={handleUpload}
              showUploadList={false}
              multiple={true}
            >
              <div>
                <PlusOutlined />
                <div>Click or drag to upload images</div>
              </div>
            </Dragger>
          </Form.Item>

          {/* Display Uploaded Images */}
          <Form.Item label="Uploaded Icons" >
            <List
              itemLayout="horizontal"
              dataSource={images}
              renderItem={(imageUrl) => (
                <List.Item
                  actions={[
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeImage(imageUrl)}
                      danger
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <img
                        src={`${baseurl}${imageUrl}`}
                        alt="Image Preview"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    }
                  // description={imageUrl}
                  />
                </List.Item>
              )}
            />
          </Form.Item>


             <Form.List name="Ads">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16 }}>
                
                {/* text1 - multiple strings */}
                <Form.List name={[name, 'text1']}>
                  {(textFields, { add: addText, remove: removeText }) => (
                    <>
                      <label>Text1 (Array):</label>
                      {textFields.map(({ key: textKey, name: textName, ...textRest }) => (
                        <Space key={textKey} style={{ display: 'flex', marginBottom: 8 }} align="start">
                          <Form.Item
                            {...textRest}
                            name={textName}
                            rules={[{ required: true, message: 'Missing text1 value' }]}
                          >
                            <Input placeholder="Enter text1 item" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => removeText(textName)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => addText()} icon={<PlusOutlined />}>
                        Add Text1 Item
                      </Button>
                    </>
                  )}
                </Form.List>

                {/* text2 - single string */}
                <Form.Item
                  {...restField}
                  name={[name, 'text2']}
                  rules={[{ required: true, message: 'Please input text2' }]}
                >
                  <Input placeholder="Enter text2" />
                </Form.Item>

                {/* link1 - single string */}
                <Form.Item
                  {...restField}
                  name={[name, 'link1']}
                  rules={[{ required: true, message: 'Please input link1' }]}
                >
                  <Input placeholder="Enter link1" />
                </Form.Item>

                <Button type="dashed" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Remove Ad Block
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Ad
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>




<Form.List name="linkArray">
  {(fields, { add, remove }) => (
    <>
      <label>Link Array</label>
      {fields.map(({ key, name, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
          <Form.Item
            {...restField}
            name={name}
            rules={[{ required: true, message: 'Missing link' }]}
          >
            <Input placeholder="Enter link" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
        Add Link
      </Button>
    </>
  )}
</Form.List>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCompBlog ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blogs;
