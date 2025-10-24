import React, { useState } from "react";
import { Button, Modal, Input, Select, Space, Typography, message, Card } from "antd";
import "antd/dist/reset.css";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;

const schemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
];

const Schema = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [segmentName, setSegmentName] = useState("");
    const [selectedSchema, setSelectedSchema] = useState("");
    const [addedSchemas, setAddedSchemas] = useState([]);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedSchema("");
    }

    const handleAddSchema = () => {
        if (!selectedSchema) {
            message.warning("Please select a schema first!");
            return;
        }
        setAddedSchemas([...addedSchemas, selectedSchema]);
        setSelectedSchema("");
    };

    const handleSchemaChange = (value, index) => {
        const updatedSchemas = [...addedSchemas];
        updatedSchemas[index] = value;
        setAddedSchemas(updatedSchemas);
    };

    const remainingOptions = schemaOptions.filter(
        (option) => !addedSchemas.includes(option.value)
    );

    const handleSave = async () => {
        if (!segmentName) {
            message.error("Please enter a segment name");
            return;
        }

        if (addedSchemas.length === 0) {
            message.error("Please add at least one schema");
            return;
        }

        const schemaData = addedSchemas.map((item) => {
            const label = schemaOptions.find((opt) => opt.value === item)?.label;
            return { [item]: label };
        });

        const payload = {
            segment_name: segmentName,
            schema: schemaData,
        };

        console.log("Data to send:", payload);

        const webhookUrl =
            "https://cors-anywhere.herokuapp.com/https://webhook.site/0200f63f-a701-4ed4-9882-f0bfcfbbbfb6";

        try {
            const res = await axios.post(
                webhookUrl,
                payload
            );
            message.success("Data sent successfully!");
            console.log("Webhook response:", res.data);
        } catch (err) {
            message.error("Failed to send data");
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <Button type="primary" onClick={showModal}>
                Save segment
            </Button>

            <Modal
                title="Save Segment"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>Enter the Name of the Segment</Text>
                    <Input
                        placeholder="Enter segment name"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                    />

                    <Text strong>Add schema to segment</Text>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Select schema"
                        value={selectedSchema || undefined}
                        onChange={(value) => setSelectedSchema(value)}
                    >
                        {remainingOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>

                    <Button type="link" onClick={handleAddSchema}>
                        + Add new schema
                    </Button>

                    {addedSchemas.length > 0 && (
                        <Card
                            style={{
                                backgroundColor: "#e6f7ff",
                                borderColor: "#91d5ff",
                                borderRadius: 8,
                            }}
                        >
                            <Space direction="vertical" style={{ width: "100%" }}>
                                {addedSchemas.map((schema, index) => (
                                    <Select
                                        key={index}
                                        value={schema}
                                        style={{ width: "100%" }}
                                        onChange={(value) => handleSchemaChange(value, index)}
                                    >
                                        {schemaOptions
                                            .filter(
                                                (opt) =>
                                                    !addedSchemas.includes(opt.value) ||
                                                    opt.value === schema
                                            )
                                            .map((opt) => (
                                                <Option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </Option>
                                            ))}
                                    </Select>
                                ))}
                            </Space>
                        </Card>
                    )}

                    <Button
                        type="primary"
                        onClick={handleSave}
                        style={{ backgroundColor: "#1890ff" }}
                    >
                        Save the segment
                    </Button>
                </Space>
            </Modal>
        </div>
    );
};

export default Schema;
