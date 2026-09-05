function PersonalInfoEditor({ value = {}, onChange = () => { } }) {
    const updateField = (field) => (event) => {
        onChange({ ...value, [field]: event.target.value });
    };

    return (
        <section>
            <h2>Personal information</h2>
            <input value={value.name || ""} onChange={updateField("name")} placeholder="Full name" />
            <input value={value.email || ""} onChange={updateField("email")} placeholder="Email" type="email" />
            <input value={value.phone || ""} onChange={updateField("phone")} placeholder="Phone" />
            <input value={value.location || ""} onChange={updateField("location")} placeholder="Location" />
            <input value={value.linkedin || ""} onChange={updateField("linkedin")} placeholder="LinkedIn URL" />
            <input value={value.website || ""} onChange={updateField("website")} placeholder="Portfolio URL" />
        </section>
    );
}

export default PersonalInfoEditor;
