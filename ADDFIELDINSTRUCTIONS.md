# Adding a New Field to `NewestForm`

Let's say you want to add a new field called:

```js
priority
```

and it is a text/select field.

## 1. Add the state

Put it in the appropriate section near the other state variables.

For example, if it belongs to **Project Overview**:

```js
const [priority, setPriority] = useState("")
```

So your state might look like:

```js
const [projName, setProjName] = useState("")
const [projDesc, setProjDesc] = useState("")
const [dueDate, setDueDate] = useState("")
const [priority, setPriority] = useState("")
const [salesRep, setSalesRep] = useState("")
```

### Rule

Every standalone form field generally needs:

```js
const [fieldName, setFieldName] = useState("")
```

---

# 2. Load the field when editing an existing project

Inside your:

```js
useEffect(() => {

    if (!projectToEdit) {
        return
    }
```

section, find the appropriate category.

For Project Overview:

```js
setPriority(
    projectToEdit.priority || ""
)
```

This is important because otherwise the field will be blank when you open an existing project.

---

# 3. Pass the state to the component

If the field lives inside `ProjectOverview`, add:

```jsx
priority={priority}
setPriority={setPriority}
```

For example:

```jsx
<ProjectOverview
    clientName={clientName}
    setClientName={setClientName}

    customerNumber={customerNumber}
    setCustomerNumber={setCustomerNumber}

    projName={projName}
    setProjName={setProjName}

    priority={priority}
    setPriority={setPriority}

    projDesc={projDesc}
    setProjDesc={setProjDesc}
/>
```

---

# 4. Add the field to the child component

Inside `ProjectOverview`, receive it:

```js
function ProjectOverview({
    clientName,
    setClientName,
    customerNumber,
    setCustomerNumber,
    projName,
    setProjName,
    priority,
    setPriority,
    projDesc,
    setProjDesc
}) {
```

Then actually render the input:

```jsx
<TextInput
    label="Priority"
    value={priority}
    onChange={e => setPriority(e.target.value)}
/>
```

So the flow is:

```text
TextInput
   ↓
setPriority()
   ↓
priority state
   ↓
NewestForm
```

---

# 5. Add the field to `getWhatChanged()`

This is the part you were working on.

Inside `getWhatChanged()`, add a comparison for the field.

For example:

```js
if (
    (projectToEdit.priority || "") !==
    priority
) {
    changes.push(
        `Changed priority from "${projectToEdit.priority || ""}" to "${priority}"`
    )
}
```

Put it in the appropriate section, such as:

```js
// =====================================================
// PROJECT OVERVIEW
// =====================================================
```

This allows your version history to say something like:

```text
Changed priority from "Normal" to "Rush"
```

---

# 6. Add it to the Supabase INSERT

This is inside `handleSubmit()`.

Find:

```js
.from("Project Versions")
.insert({
```

Then add:

```js
priority: priority,
```

For example:

```js
.insert({

    project_id:
        projectId,

    version_number:
        versionNumber,

    client_name:
        clientName,

    customer_number:
        customerNumber,

    project_name:
        projName,

    priority:
        priority,

    project_description:
        projDesc,

    due_date:
        dueDate || null,

    ...
})
```

---

# 7. Make sure the database column exists

Your Supabase table also needs:

```text
Project Versions
    ↓
priority
```

with the appropriate data type.

For a normal text field:

```sql
ALTER TABLE "Project Versions"
ADD COLUMN priority text;
```

---

# 8. Decide whether it belongs to a version

This is important for your particular application.

Since you're creating a **new Project Version instead of overwriting the existing version**, ask:

> Should this field be part of the saved version?

If **yes**, it belongs in `"Project Versions"` and follows all the steps above.

If **no**, it may belong in `"Projects"` instead.

For example:

```text
Projects
├── id
├── client_name
└── customer_number

Project Versions
├── id
├── project_id
├── version_number
├── project_name
├── project_description
├── priority
└── ...
```

---

# 9. If it's an array/object field, handle it differently

Not every field is a simple:

```js
const [field, setField] = useState("")
```

For example, your components are an array:

```js
const [components, setComponents] = useState([...])
```

So when adding a field to a **component**, you need to add it to the component object:

```js
{
    id: crypto.randomUUID(),
    componentKey: crypto.randomUUID(),

    Component: "",
    Size: "",
    FlatSize: "",
    Stock: "",
    Coating: "",

    priority: "",

    quantities: [""],
    saved: false,
    finishingOps: [],
    SameQty: false
}
```

Then you need to make sure it is:

1. Initialized when creating a component
2. Loaded when editing
3. Passed to `Components2`
4. Updated by `updateComponent`
5. Saved to `Components`
6. Compared in `getWhatChanged()`

---

# Your Complete Checklist

Whenever you add a new field, run through this list:

### Simple standalone field

```text
1. State
   ↓
2. Load existing value
   ↓
3. Pass state to child component
   ↓
4. Receive state in child component
   ↓
5. Render input
   ↓
6. Add change detection
   ↓
7. Add to Supabase INSERT
   ↓
8. Add database column
```

### For a field inside Components

```text
1. Add property to initial component object
   ↓
2. Add property to addComponent()
   ↓
3. Load property from Supabase
   ↓
4. Pass component to Components2
   ↓
5. Render/update field in Components2
   ↓
6. Save property to Components
   ↓
7. Add property comparison to getWhatChanged()
```

### For a new section/collection

For something like Kitting or Mailing:

```text
1. State
   ↓
2. Initial structure
   ↓
3. Add/update/remove functions
   ↓
4. Load existing data
   ↓
5. Render child component
   ↓
6. Save to Supabase
   ↓
7. Save related child records
   ↓
8. Add change detection
```

---

## One especially important thing for your version system

Because you're **creating a new version rather than overwriting the old one**, you should think of `getWhatChanged()` as a **comparison between two snapshots**:

```text
OLD VERSION
     ↓
projectToEdit
     ↓
compare
     ↑
current React state
     ↑
NEW VERSION
```

So whenever you add a field, there are really **two separate jobs**:

**Saving the field:**

```js
priority: priority
```

and **explaining the change:**

```js
if (oldPriority !== priority) {
    changes.push(...)
}
```

Those are separate and both need to be added.

Also, I noticed your pasted file currently contains **two identical `getWhatChanged()` functions**. You should delete one of them—having both in the same component will cause a duplicate declaration error.
