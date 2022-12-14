// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

$.ajax(
  {
    url: "http://localhost:3000/getEquipment",
    success: function (result) {
      var ctx = document.getElementById("myBarChart");
      var ctx2 = document.getElementById("networkDeviceBarChart");
      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: result.EquipmentLable,
          datasets: [{
            label: "Total",
            backgroundColor: "#4e73df",
            hoverBackgroundColor: "#2e59d9",
            borderColor: "#4e73df",
            data: result.EquimentData,
          }],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'month'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: result.maxTicksLimit
              },
              maxBarThickness: 25,
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: 100,
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return '' + number_format(value);
                }
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
              }
            }
          },
        }
      });

      //Network Device Bar Chart
      var networkBarChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: result.EquipmentLable,
          datasets: [{
            label: "Total",
            backgroundColor: "#4e73df",
            hoverBackgroundColor: "#2e59d9",
            borderColor: "#4e73df",
            data: result.networkEquimentData,
          }],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'month'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: result.maxTicksLimit
              },
              maxBarThickness: 25,
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: 100,
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return '' + number_format(value);
                }
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
              }
            }
          },
        }
      });

      document.getElementById('seveneleven').textContent = result.seveneleven;
      document.getElementById('m2cash').textContent = result.m2cash;

      console.log(result.EquipmentLable + result.EquimentData + result.maxTicksLimit)
    }
  });
function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Bar Chart Example


// $(document).ready(function(){  
//   alert('application started');  

//   getdata();  

//   $('.addbtn').click(function(){  
//        var task = $("#task").val();  
//      $.ajax({  
//          url:'/task/addtask',  
//          method:'post',  
//          dataType:'json',  
//          data:{'task':task},  
//          success:function(response){  
//              if(response.msg=='success'){  
//              alert('task added successfully');  
//              getdata();  
//              $('#task').val('')  
//              }else{  
//                  alert('some error occurred try again');  
//              }  
//          },  
//          error:function(response){  
//              alert('server error occured')  
//          }  
//      });  
//   });  
//   $(document).on('click','button.del',function(){  
//       var id = $(this).parent().find('button.del').val(); 
//       $.ajax({  
//           url:'/task/removetask',  
//           method:'delete',  
//           dataType:'json',  
//           data:{'id':id},  
//           success:function(response){  
//               if(response.msg=='success'){  
//                   alert('data deleted');  
//                   getdata();  
//               }else{  
//                   alert('data not get deleted');  
//               }  
//           },  
//           error:function(response){  
//                    alert('server error')     
//           }  
//       });  
//   });  
//   function getdata(){  
//       $.ajax({  
//           url:'/task/gettask',  
//           method:'get',  
//           dataType:'json',  
//           success:function(response){  
//                if(response.msg=='success'){  
//                    $('tr.taskrow').remove()  
//                    if(response.data==undefined || response.data==null || response.data==''){  
//                        $('.tblData').hide();  
//                    }else{  
//                       $('.tblData').show();  
//                    $.each(response.data,function(index,data){  
//                        var url = url+data._id;  
//                        index+=1;  
//           $('tbody').append("<tr class='taskrow'><td>"+ index +"</td><td>"+data.task+"</td><td>"+"<button class='del' value='"+data._id+"'>delete</button>"+"</td></tr>");   
//                    });  
//                }  
//              }  
//           },  
//           error:function(response){  
//               alert('server error');  
//           }  
//       });  
//   }  
// });  
