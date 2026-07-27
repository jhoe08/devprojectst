$(".alert_danger").click(async function (e) {
    const name = $(this).data('name');
    const path = $(this).data('path');
    const id = $(this).data('id');

    swal({
        icon: "warning",
        title: `Delete ***${name}***?`,
        text: "You won't be able to revert this!",
        buttons: {
            cancel: {
                visible: true,
                text: "No, cancel!",
                className: "btn btn-danger",
            },
            confirm: {
                text: "Yes, delete it!",
                className: "btn btn-success",
            },
        },
    }).then(async (willDelete) => {
        if (willDelete) {
            try {
                const response = await fetch(`${path}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, path, id })
                });

                console.log(response)

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                swal("Deletion confirmed!",
                    `***${name}*** has been removed from the system.`, {
                    icon: "success",
                    buttons: {
                        confirm: { className: "btn btn-success" },
                    },
                });

                console.log("Archive response:", data);

                // Optional: remove the row from the UI immediately
                $(this).closest('tr').fadeOut();

            } catch (error) {
                swal("Error!", "Failed to delete the record.", {
                    icon: "error",
                    buttons: {
                        confirm: { className: "btn btn-danger" },
                    },
                });
                console.error("Fetch error:", error);
            }
        }
    });
});
