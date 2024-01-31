export const allMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  export const color = [
    "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(204, 102, 0, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(72, 113, 247, 1)",
      "rgba(102, 204, 0, 1)",
      "rgba(51, 51, 51, 1)",
      "rgba(255, 255, 51, 1)",
      "rgba(204, 204, 204, 1)"
  ];

  export const ChartColor = {
    backgroundColor: [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(204, 102, 0, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(72, 113, 247, 0.7)",
      "rgba(102, 204, 0, 0.7)",
      "rgba(51, 51, 51, 0.7)",
      "rgba(255, 255, 51, 0.7)",
      "rgba(204, 204, 204, 0.7)"
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(204, 102, 0, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(72, 113, 247, 1)",
      "rgba(102, 204, 0, 1)",
      "rgba(51, 51, 51, 1)",
      "rgba(255, 255, 51, 1)",
      "rgba(204, 204, 204, 1)"
    ],
    borderWidth: 1,
  };
  export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  export const optionsProjectAnalytics = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Project Analytics",
        font: {
          size: 22,
        },
      },
      tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || "";
                        let hour=context.dataset.data[context.dataIndex].toFixed(2);
                        let hourSplit=hour.split(".");
                        hour=hourSplit[0]+":"+(hourSplit[1]*60/100).toFixed(0);
                       
                        if (label) {
                            label += ": "+hour;
                        }
                      
                        return label;
                    }
                }
            }
    },
    maxBarThickness: 100,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };


  export const optionsTeamAnalytics = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Team Analytics",
        font: {
          size: 22,
        },
      },
      tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || "";
                        let hour=context.dataset.data[context.dataIndex].toFixed(2);
                        let hourSplit=hour.split(".");
                        hour=hourSplit[0]+":"+(hourSplit[1]*60/100).toFixed(0);
                       
                        if (label) {
                            label += ": "+hour;
                        }
                      
                        return label;
                    }
                }
            }
    },
    maxBarThickness: 100,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };


   export const ProjectAnalyticsPieChart = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Project Analytics",
        font: {
          size: 22,
        },
      },
      tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || "";
                        let hour=context.dataset.data[context.dataIndex].toFixed(2);
                        let hourSplit=hour.split(".");
                        hour=hourSplit[0]+":"+(hourSplit[1]*60/100).toFixed(0);
                       
                        if (label) {
                            label += ": "+hour;
                        }
                      
                        return label;
                    }
                }
            }
    },
  
  };


  export const TeamAnalyticsPieChart = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Team Analytics",
        font: {
          size: 22,
        },
      },
      tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || "";
                        let hour=context.dataset.data[context.dataIndex].toFixed(2);
                        let hourSplit=hour.split(".");
                        hour=hourSplit[0]+":"+(hourSplit[1]*60/100).toFixed(0);
                       
                        if (label) {
                            label += ": "+hour;
                        }
                      
                        return label;
                    }
                }
            }
    },
  
  };

export const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "close", label: "Closed" }
];

export const priorityFilterOptions = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

export const statusFormOptions = [
  { value: "open", label: "Open" },
  { value: "close", label: "Closed" }
];

export const priority = [
  {
    cat: "low",
    key: "Low",
  },
  {
    cat: "medium",
    key: "Medium",
  },
  {
    cat: "high",
    key: "High",
  },
  
];
