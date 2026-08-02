const MiniCard = ({ heading = "", fields = [], data = {} }) => {
    console.log("Mini Card's data:", data);
    return (
        <article key={heading} className="detail__location-card--mini detail__location-card detail__location-card--compact">
            <h3>{heading}</h3>
            {fields && Array.isArray(fields) ? fields.map(f => {
                switch (f.toLowerCase().trim()) {
                    case "description":
                        return (<p key={f} className="detail__location-description">
                            {data.description || "No description added yet."}
                        </p>)
                        break;
                    case "atmosphere":
                        return (<p className="detail__location-atmosphere">
                            <strong>{f}: </strong>
                            {data.atmosphere}
                        </p>)
                        break;
                    case "story_role":
                        return (<p key={f} className="detail__location-atmosphere">
                            <strong>{data.story_role}</strong>
                        </p>)
                        break;
                    case "goal":
                        return (<p key={f} className="detail__location-atmosphere">
                            <strong>Story goal: </strong>
                            {data.goal}
                        </p>)
                        break;
                    case "knowledge_notes":
                        return (<p key={f} className="detail__location-atmosphere">
                            <strong>Knowledge notes: </strong>
                            {data.knowledge_notes}
                        </p>)
                        break;
                    default:
                        ""
                }
            }) : ""}
        </article>
    );
}

export default MiniCard;