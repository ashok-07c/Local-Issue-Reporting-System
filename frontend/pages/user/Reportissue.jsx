import ReportIssueForm from './../../components/forms/ReportIssueForm.jsx';
export default function ReportIssue(){
    return(
        <div className="report-issue">
            <div className="report-text">
                <h2>Report an Issue</h2>
                <p>Help us improve your community by reporting local issues.</p>
                <p>Your report will be dent to the relevant authorities. </p>
            </div>
            <div className="report-issue-form">
                <ReportIssueForm />
            </div>
        </div>
    )
}