export default function ApiKeysLoading() {
    return (
        <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-3">
                            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}