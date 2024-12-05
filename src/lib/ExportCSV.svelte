<script>
    export let data = {}; // Expecting data as an object, like `voteCounts`
    export let filename = 'export.csv';

    // Function to safely encapsulate and escape CSV data
    const escapeForCSV = (value) => {
        if (typeof value === "string") {
            // Escape double quotes by doubling them and encapsulate in quotes
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value; // If not a string, return as is (numbers, etc.)
    };

    // Function to convert the data into CSV format and trigger download
    const downloadCSV = () => {
        // Convert data to array of entries if needed
        const entries = Object.entries(data);

        // Create CSV headers
        let csvContent = "data:text/csv;charset=utf-8,Response,Count\n";

        // Loop through entries and add rows to CSV
        entries.forEach(([response, count]) => {
            csvContent += `${escapeForCSV(response)},${escapeForCSV(count)}\n`;
        });

        // Create a download link and trigger it
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);

        // Start download and remove link element
        link.click();
        document.body.removeChild(link);
    };
</script>

<strong>➜</strong>
<button on:click={downloadCSV} class="bg-blue-500 text-white px-4 py-2 rounded">
    Export as CSV
</button>

<style>
button {
    background-color: #1a1a1a;
    margin: 1rem;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
