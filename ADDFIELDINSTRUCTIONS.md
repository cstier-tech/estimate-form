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

So the state might look like:

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

Inside the:

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

This allows the version history to say something like:

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

The Supabase table also needs:

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

This is important for the particular application.

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

For example, the components are an array:

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
3. Passed to `JobComponents`
4. Updated by `updateComponent`
5. Saved to `Components`
6. Compared in `getWhatChanged()`

---

# The Complete Checklist

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
4. Pass component to JobComponents
   ↓
5. Render/update field in JobComponents
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

## One especially important thing for the version system

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

TLDR:
1. Add state in `NewestForm`
2. Add it to the child component props
3. Render the field in the child component
4. Load it from projectToEdit in the useEffect
5. Add it to `getWhatChanged()`
6. Add it to the Supabase `.insert()`
7. Add the database column if it doesn't already exist




**Adding a field to `Components` is a little different** because the component data is stored as an array of objects rather than as individual pieces of state.

With the current structure, you should **not create separate state** like:

```js
const [componentStock, setComponentStock] = useState("")
```

Instead, add the new field to each component object.

Let's say you're adding:

```js
Color
```

## 1. Add it to the initial component

Find:

```js
const [components, setComponents] = useState([
    {
        id: crypto.randomUUID(),
        componentKey: crypto.randomUUID(),
        Component: "",
        Size: "",
        FlatSize: "",
        Stock: "",
        Coating: "",
        quantities: [""],
        saved: false,
        finishingOps: [],
        SameQty: false
    }
])
```

Add:

```js
Color: "",
```

So:

```js
const [components, setComponents] = useState([
    {
        id: crypto.randomUUID(),
        componentKey: crypto.randomUUID(),

        Component: "",
        Size: "",
        FlatSize: "",
        Stock: "",
        Coating: "",
        Color: "",

        quantities: [""],
        saved: false,
        finishingOps: [],
        SameQty: false
    }
])
```

---

## 2. Add it to `addComponent()`

You have a second place where a new component is created:

```js
const addComponent = () => {

    setComponents(prev => [
        ...prev,
        {
            id: crypto.randomUUID(),
            componentKey: crypto.randomUUID(),
            Component: "",
            Size: "",
            FlatSize: "",
            Stock: "",
            Coating: "",
            quantities: [""],
            saved: false,
            finishingOps: [],
            SameQty: false
        }
    ])
}
```

Add the field there too:

```js
Color: "",
```

---

## 3. Add it to the component loading code

In the `loadedComponents` mapping, you currently have:

```js
Component:
    component.component_name ||
    "",

Size:
    component.size ||
    "",

FlatSize:
    component.flat_size ||
    "",

Stock:
    component.stock ||
    "",

Coating:
    component.coating ||
    "",
```

Add:

```js
Color:
    component.color ||
    "",
```

So:

```js
Component:
    component.component_name ||
    "",

Size:
    component.size ||
    "",

FlatSize:
    component.flat_size ||
    "",

Stock:
    component.stock ||
    "",

Coating:
    component.coating ||
    "",

Color:
    component.color ||
    "",
```

This is what makes the field populate when you **edit an existing version**.

---

## 4. Add it to the fallback component

You also have this:

```js
: [{
    id: crypto.randomUUID(),

    Component: "",

    Size: "",

    FlatSize: "",

    Stock: "",

    Coating: "",

    quantities: [""],

    saved: false,

    finishingOps: [],

    SameQty: false
}]
```

Add:

```js
Color: "",
```

---

## 5. Add the field to `JobComponents`

The parent already passes the entire component:

```jsx
<JobComponents
    component={component}
    ...
/>
```

So you **do not need to add another prop just to make the value available**.

Inside `JobComponents`, you can use:

```js
component.Color
```

And update it with the existing generic function:

```js
updateComponent(
    index,
    "Color",
    e.target.value
)
```

For example:

```jsx
<TextInput
    label="Color"
    value={component.Color}
    onChange={e =>
        updateComponent(
            index,
            "Color",
            e.target.value
        )
    }
/>
```

That's one of the nice things about the current setup.

---

# 6. Add it to the Supabase INSERT

Inside `handleSubmit()`, find:

```js
.from("Components")
.insert({
```

You currently have:

```js
.insert({

    version_id:
        versionId,

    component_key:
        component.componentKey,

    component_name:
        component.Component,

    size:
        component.Size,

    flat_size:
        component.FlatSize,

    stock:
        component.Stock,

    coating:
        component.Coating,

    saved:
        component.saved
})
```

Add:

```js
color:
    component.Color,
```

So:

```js
.insert({

    version_id:
        versionId,

    component_key:
        component.componentKey,

    component_name:
        component.Component,

    size:
        component.Size,

    flat_size:
        component.FlatSize,

    stock:
        component.Stock,

    coating:
        component.Coating,

    color:
        component.Color,

    saved:
        component.saved
})
```

---

# 7. Add it to `getWhatChanged()`

This is the part that's especially important for the version history.

Inside:

```js
// CHANGED COMPONENTS
```

you already have:

```js
if (
    (oldComponent.coating || "") !==
    component.Coating
) {
    changes.push(
        `Changed "${componentName}" coating from "${oldComponent.coating || ""}" to "${component.Coating}"`
    )
}
```

Add:

```js
if (
    (oldComponent.color || "") !==
    component.Color
) {
    changes.push(
        `Changed "${componentName}" color from "${oldComponent.color || ""}" to "${component.Color}"`
    )
}
```

---

# 8. Add the database column

The `Components` table needs:

```sql
ALTER TABLE "Components"
ADD COLUMN color text;
```

---

# So the Components checklist is:

When adding a field to `Components`, you have **8 places** to think about:

```text
COMPONENT FIELD
│
├── 1. Initial component object
│
├── 2. addComponent()
│
├── 3. Load existing component
│
├── 4. Fallback component
│
├── 5. JobComponents UI
│
├── 6. Components Supabase INSERT
│
├── 7. getWhatChanged()
│
└── 8. Components database column
```

### The important distinction

For a **normal Project Overview field**:

```js
const [priority, setPriority] = useState("")
```

For a **Component field**:

```js
{
    Component: "",
    Size: "",
    Color: ""
}
```

You already have the generic updater:

```js
updateComponent(index, field, value)
```

so you can simply do:

```js
updateComponent(index, "Color", value)
```

**No new `useState` is needed for `Color`.**

And this same pattern applies to virtually any new field you add to a component—dimensions, ink colors, pages, notes, special instructions, etc.


TLDR:

1. **Add the field to the initial component object** in `NewestForm`
2. **Add the field to `addComponent()`** so new components include it
3. **Render the field in `JobComponents`**
4. **Use `updateComponent()` to update the field** in the component state
5. **Load the field from `projectToEdit`** in the `useEffect`
6. **Add the field to the `getWhatChanged()`** component comparison
7. **Add the field to the `Components` Supabase `.insert()`**
8. **Add the database column** if it doesn't already exist
